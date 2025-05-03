module meme_coin_platform::dex_integration {
    use std::string::{Self, String};
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::coin::{Self, Coin};
    use sui::event;
    use sui::balance::{Self, Balance};
    use sui::sui::SUI;
    
    /// Error codes
    const EInsufficientLiquidity: u64 = 0;
    const EInvalidAmount: u64 = 1;
    const ESlippageExceeded: u64 = 2;
    
    /// Bonding curve pool for a meme coin
    struct BondingCurvePool<phantom T> has key {
        id: UID,
        coin_type: String,
        sui_balance: Balance<SUI>,
        token_balance: Balance<T>,
        creator: address,
        fee_percent: u64, // basis points (1/100 of 1%)
        k: u64, // bonding curve constant
    }
    
    /// Events
    struct PoolCreatedEvent has copy, drop {
        pool_id: address,
        coin_type: String,
        initial_sui: u64,
        initial_tokens: u64,
        creator: address,
    }
    
    struct SwapEvent has copy, drop {
        pool_id: address,
        trader: address,
        sui_amount: u64,
        token_amount: u64,
        is_buy: bool,
    }
    
    /// Create a new bonding curve pool
    public fun create_pool<T>(
        sui_coin: Coin<SUI>,
        token_coin: Coin<T>,
        fee_percent: u64,
        ctx: &mut TxContext
    ) {
        let sui_amount = coin::value(&sui_coin);
        let token_amount = coin::value(&token_coin);
        
        // Ensure non-zero amounts
        assert!(sui_amount > 0, EInvalidAmount);
        assert!(token_amount > 0, EInvalidAmount);
        
        // Extract balances
        let sui_balance = coin::into_balance(sui_coin);
        let token_balance = coin::into_balance(token_coin);
        
        // Calculate k (x * y = k)
        let k = sui_amount * token_amount;
        
        // Create pool
        let pool = BondingCurvePool<T> {
            id: object::new(ctx),
            coin_type: string::utf8(b"T"), // This would be the actual type in practice
            sui_balance,
            token_balance,
            creator: tx_context::sender(ctx),
            fee_percent,
            k,
        };
        
        // Share pool object
        transfer::share_object(pool);
        
        // Emit event
        event::emit(PoolCreatedEvent {
            pool_id: object::uid_to_address(&pool.id),
            coin_type: string::utf8(b"T"), // This would be the actual type in practice
            initial_sui: sui_amount,
            initial_tokens: token_amount,
            creator: tx_context::sender(ctx),
        });
    }
    
    /// Buy tokens with SUI
    public fun buy<T>(
        pool: &mut BondingCurvePool<T>,
        sui_coin: Coin<SUI>,
        min_tokens_out: u64,
        ctx: &mut TxContext
    ): Coin<T> {
        let sui_in = coin::value(&sui_coin);
        assert!(sui_in > 0, EInvalidAmount);
        
        // Calculate tokens out based on bonding curve formula
        let sui_balance_before = balance::value(&pool.sui_balance);
        let token_balance_before = balance::value(&pool.token_balance);
        
        // x * y = k formula
        // (sui_balance + sui_in) * (token_balance - tokens_out) = k
        // tokens_out = token_balance - (k / (sui_balance + sui_in))
        let new_sui_balance = sui_balance_before + sui_in;
        let new_token_balance = pool.k / new_sui_balance;
        let tokens_out = token_balance_before - new_token_balance;
        
        // Apply fee
        let fee = (tokens_out * pool.fee_percent) / 10000;
        let tokens_out_after_fee = tokens_out - fee;
        
        // Check slippage
        assert!(tokens_out_after_fee >= min_tokens_out, ESlippageExceeded);
        
        // Update balances
        balance::join(&mut pool.sui_balance, coin::into_balance(sui_coin));
        let token_out = coin::from_balance(balance::split(&mut pool.token_balance, tokens_out_after_fee), ctx);
        
        // Emit event
        event::emit(SwapEvent {
            pool_id: object::uid_to_address(&pool.id),
            trader: tx_context::sender(ctx),
            sui_amount: sui_in,
            token_amount: tokens_out_after_fee,
            is_buy: true,
        });
        
        token_out
    }
    
    /// Sell tokens for SUI
    public fun sell<T>(
        pool: &mut BondingCurvePool<T>,
        token_coin: Coin<T>,
        min_sui_out: u64,
        ctx: &mut TxContext
    ): Coin<SUI> {
        let tokens_in = coin::value(&token_coin);
        assert!(tokens_in > 0, EInvalidAmount);
        
        // Calculate SUI out based on bonding curve formula
        let sui_balance_before = balance::value(&pool.sui_balance);
        let token_balance_before = balance::value(&pool.token_balance);
        
        // x * y = k formula
        // (sui_balance - sui_out) * (token_balance + tokens_in) = k
        // sui_out = sui_balance - (k / (token_balance + tokens_in))
        let new_token_balance = token_balance_before + tokens_in;
        let new_sui_balance = pool.k / new_token_balance;
        let sui_out = sui_balance_before - new_sui_balance;
        
        // Apply fee
        let fee = (sui_out * pool.fee_percent) / 10000;
        let sui_out_after_fee = sui_out - fee;
        
        // Check slippage
        assert!(sui_out_after_fee >= min_sui_out, ESlippageExceeded);
        
        // Update balances
        balance::join(&mut pool.token_balance, coin::into_balance(token_coin));
        let sui_out_coin = coin::from_balance(balance::split(&mut pool.sui_balance, sui_out_after_fee), ctx);
        
        // Emit event
        event::emit(SwapEvent {
            pool_id: object::uid_to_address(&pool.id),
            trader: tx_context::sender(ctx),
            sui_amount: sui_out_after_fee,
            token_amount: tokens_in,
            is_buy: false,
        });
        
        sui_out_coin
    }
}
