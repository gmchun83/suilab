module meme_coin_platform::meme_coin {
    use std::string::{Self, String};
    use sui::coin::{Self, Coin, TreasuryCap};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::object::{Self, UID};
    use sui::event;

    /// Error codes
    const EInvalidSupply: u64 = 0;
    const EInvalidName: u64 = 1;
    const EInvalidSymbol: u64 = 2;

    /// Capability that grants permission to mint and burn tokens
    struct MemeCoinAdminCap has key, store {
        id: UID,
        coin_id: UID,
    }

    /// Coin metadata
    struct MemeCoinMetadata has key, store {
        id: UID,
        name: String,
        symbol: String,
        description: String,
        creator: address,
        created_at: u64,
        icon_url: String,
    }

    /// Events
    struct CoinCreatedEvent has copy, drop {
        coin_id: address,
        name: String,
        symbol: String,
        creator: address,
        initial_supply: u64,
    }

    struct CoinBoughtEvent has copy, drop {
        coin_id: address,
        buyer: address,
        amount: u64,
        price: u64,
    }

    struct CoinSoldEvent has copy, drop {
        coin_id: address,
        seller: address,
        amount: u64,
        price: u64,
    }

    struct CoinBurnedEvent has copy, drop {
        coin_id: address,
        burner: address,
        amount: u64,
    }

    /// Create a new meme coin with custom parameters
    public entry fun create_coin(
        name: vector<u8>,
        symbol: vector<u8>,
        description: vector<u8>,
        icon_url: vector<u8>,
        initial_supply: u64,
        decimals: u8,
        ctx: &mut TxContext
    ) {
        // Validate inputs
        assert!(initial_supply > 0, EInvalidSupply);
        let name_str = string::utf8(name);
        let symbol_str = string::utf8(symbol);
        
        assert!(string::length(&name_str) > 0, EInvalidName);
        assert!(string::length(&symbol_str) > 0, EInvalidSymbol);
        
        // Create the coin
        let (treasury_cap, coin_metadata) = coin::create_currency(
            name_str,
            symbol_str,
            decimals,
            Some(string::utf8(icon_url)),
            ctx
        );
        
        // Mint initial supply to creator
        let initial_coins = coin::mint(&mut treasury_cap, initial_supply, ctx);
        transfer::public_transfer(initial_coins, tx_context::sender(ctx));
        
        // Create metadata object
        let metadata = MemeCoinMetadata {
            id: object::new(ctx),
            name: name_str,
            symbol: symbol_str,
            description: string::utf8(description),
            creator: tx_context::sender(ctx),
            created_at: tx_context::epoch(ctx),
            icon_url: string::utf8(icon_url),
        };
        
        // Create admin capability
        let admin_cap = MemeCoinAdminCap {
            id: object::new(ctx),
            coin_id: object::uid_to_inner(&metadata.id),
        };
        
        // Transfer ownership
        transfer::public_transfer(treasury_cap, tx_context::sender(ctx));
        transfer::public_share_object(metadata);
        transfer::public_transfer(admin_cap, tx_context::sender(ctx));
        
        // Emit event
        event::emit(CoinCreatedEvent {
            coin_id: object::uid_to_address(&metadata.id),
            name: name_str,
            symbol: symbol_str,
            creator: tx_context::sender(ctx),
            initial_supply,
        });
    }
    
    /// Burn coins
    public entry fun burn_coins<T>(
        treasury_cap: &mut TreasuryCap<T>,
        coin: Coin<T>,
        ctx: &mut TxContext
    ) {
        let amount = coin::value(&coin);
        coin::burn(treasury_cap, coin);
        
        // Emit event
        event::emit(CoinBurnedEvent {
            coin_id: object::id_address(treasury_cap),
            burner: tx_context::sender(ctx),
            amount,
        });
    }
}
