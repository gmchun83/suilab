module meme_coin_platform::meme_coin {
    use std::string::{Self, String};
    use sui::coin::{Self, Coin, TreasuryCap};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::object::{Self, UID};
    use sui::event;
    use sui::balance::{Self, Balance};
    use sui::sui::SUI;

    /// Error codes
    const EInvalidSupply: u64 = 0;
    const EInvalidName: u64 = 1;
    const EInvalidSymbol: u64 = 2;
    const EInvalidAmount: u64 = 3;
    const EUnauthorized: u64 = 4;
    const EInsufficientBalance: u64 = 5;

    /// Burn fee percentage (in basis points, 1/100 of 1%)
    const BURN_FEE_BP: u64 = 100; // 1% fee

    /// Minimum burn amount (in token units)
    const MIN_BURN_AMOUNT: u64 = 1000;

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
        total_supply: u64,
        circulating_supply: u64,
        burned_supply: u64,
        holders: u64,
        dex_listed: bool,
        dex_pool_id: address,
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
            total_supply: initial_supply,
            circulating_supply: initial_supply,
            burned_supply: 0,
            holders: 1, // Creator is the first holder
            dex_listed: false,
            dex_pool_id: @0x0, // Zero address until DEX listed
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
        metadata: &mut MemeCoinMetadata,
        coin: Coin<T>,
        ctx: &mut TxContext
    ) {
        let amount = coin::value(&coin);

        // Validate burn amount
        assert!(amount >= MIN_BURN_AMOUNT, EInvalidAmount);

        // Calculate burn fee (1% by default)
        let fee_amount = (amount * BURN_FEE_BP) / 10000;
        let burn_amount = amount - fee_amount;

        // Split the coin for fee
        let fee_coin = coin::split(&mut coin, fee_amount, ctx);

        // Burn the remaining coins
        coin::burn(treasury_cap, coin);

        // Send fee to creator
        transfer::public_transfer(fee_coin, metadata.creator);

        // Update metadata
        metadata.burned_supply = metadata.burned_supply + burn_amount;
        metadata.circulating_supply = metadata.circulating_supply - amount;

        // Emit event
        event::emit(CoinBurnedEvent {
            coin_id: object::uid_to_address(&metadata.id),
            burner: tx_context::sender(ctx),
            amount: burn_amount,
        });
    }

    /// Update DEX listing status
    public entry fun update_dex_listing<T>(
        metadata: &mut MemeCoinMetadata,
        dex_pool_id: address,
        ctx: &mut TxContext
    ) {
        // Only creator can update DEX listing
        assert!(tx_context::sender(ctx) == metadata.creator, EUnauthorized);

        // Update metadata
        metadata.dex_listed = true;
        metadata.dex_pool_id = dex_pool_id;
    }

    // Accessor functions for testing

    #[test_only]
    public fun get_name(metadata: &MemeCoinMetadata): String {
        metadata.name
    }

    #[test_only]
    public fun get_symbol(metadata: &MemeCoinMetadata): String {
        metadata.symbol
    }

    #[test_only]
    public fun get_creator(metadata: &MemeCoinMetadata): address {
        metadata.creator
    }

    #[test_only]
    public fun get_total_supply(metadata: &MemeCoinMetadata): u64 {
        metadata.total_supply
    }

    #[test_only]
    public fun get_circulating_supply(metadata: &MemeCoinMetadata): u64 {
        metadata.circulating_supply
    }

    #[test_only]
    public fun get_burned_supply(metadata: &MemeCoinMetadata): u64 {
        metadata.burned_supply
    }

    #[test_only]
    public fun get_holders(metadata: &MemeCoinMetadata): u64 {
        metadata.holders
    }

    #[test_only]
    public fun is_dex_listed(metadata: &MemeCoinMetadata): bool {
        metadata.dex_listed
    }

    #[test_only]
    public fun get_dex_pool_id(metadata: &MemeCoinMetadata): address {
        metadata.dex_pool_id
    }
}
