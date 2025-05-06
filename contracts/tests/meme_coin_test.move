#[test_only]
module meme_coin_platform::meme_coin_test {
    use std::string;
    use sui::test_scenario::{Self as ts, Scenario};
    use sui::coin::{Self, Coin, TreasuryCap};
    use sui::test_utils::{assert_eq};
    use sui::transfer;
    use sui::object::{Self, ID};
    
    use meme_coin_platform::meme_coin::{Self, MemeCoinMetadata, MemeCoinAdminCap};
    
    // Test addresses
    const CREATOR: address = @0xCAFE;
    const USER: address = @0xFACE;
    
    // Test constants
    const INITIAL_SUPPLY: u64 = 1_000_000_000_000; // 1 trillion tokens
    const BURN_AMOUNT: u64 = 10_000_000; // 10 million tokens
    
    // Helper function to set up a test scenario with a meme coin
    fun setup_coin(): Scenario {
        // Start test scenario with creator
        let scenario = ts::begin(CREATOR);
        
        // Create meme coin
        {
            let ctx = ts::ctx(&mut scenario);
            
            // Create meme coin
            meme_coin::create_coin(
                b"Test Meme Coin",
                b"TMC",
                b"A test meme coin for the Sui blockchain",
                b"https://example.com/icon.png",
                INITIAL_SUPPLY,
                9, // 9 decimals
                ctx
            );
        };
        
        scenario
    }
    
    #[test]
    fun test_create_coin() {
        let scenario = setup_coin();
        
        // Verify coin was created
        {
            ts::next_tx(&mut scenario, CREATOR);
            
            // Check that metadata exists
            assert!(ts::has_most_recent_shared<MemeCoinMetadata>(), 0);
            
            // Check that treasury cap was transferred to creator
            assert!(ts::has_most_recent_for_address<TreasuryCap<MemeCoinMetadata>>(CREATOR), 0);
            
            // Check that admin cap was transferred to creator
            assert!(ts::has_most_recent_for_address<MemeCoinAdminCap>(CREATOR), 0);
            
            // Get metadata
            let metadata = ts::take_shared<MemeCoinMetadata>(&scenario);
            
            // Verify metadata properties
            assert_eq(meme_coin::get_name(&metadata), string::utf8(b"Test Meme Coin"));
            assert_eq(meme_coin::get_symbol(&metadata), string::utf8(b"TMC"));
            assert_eq(meme_coin::get_creator(&metadata), CREATOR);
            assert_eq(meme_coin::get_total_supply(&metadata), INITIAL_SUPPLY);
            assert_eq(meme_coin::get_circulating_supply(&metadata), INITIAL_SUPPLY);
            assert_eq(meme_coin::get_burned_supply(&metadata), 0);
            assert_eq(meme_coin::get_holders(&metadata), 1);
            assert_eq(meme_coin::is_dex_listed(&metadata), false);
            
            // Return metadata
            ts::return_shared(metadata);
        };
        
        ts::end(scenario);
    }
    
    #[test]
    fun test_burn_coins() {
        let scenario = setup_coin();
        
        // Transfer some coins to user
        {
            ts::next_tx(&mut scenario, CREATOR);
            
            // Take creator's coins
            let coins = ts::take_from_sender<Coin<MemeCoinMetadata>>(&scenario);
            
            // Split some coins for user
            let user_coins = coin::split(&mut coins, BURN_AMOUNT, ts::ctx(&mut scenario));
            
            // Transfer coins
            transfer::public_transfer(user_coins, USER);
            transfer::public_transfer(coins, CREATOR);
        };
        
        // Burn coins
        {
            ts::next_tx(&mut scenario, USER);
            
            // Take user's coins
            let coins = ts::take_from_sender<Coin<MemeCoinMetadata>>(&scenario);
            
            // Take treasury cap
            let treasury_cap = ts::take_from_address<TreasuryCap<MemeCoinMetadata>>(&scenario, CREATOR);
            
            // Take metadata
            let metadata = ts::take_shared<MemeCoinMetadata>(&scenario);
            
            // Get initial values
            let initial_circulating = meme_coin::get_circulating_supply(&metadata);
            let initial_burned = meme_coin::get_burned_supply(&metadata);
            
            // Burn coins
            meme_coin::burn_coins(
                &mut treasury_cap,
                &mut metadata,
                coins,
                ts::ctx(&mut scenario)
            );
            
            // Calculate expected values
            let fee_amount = (BURN_AMOUNT * 100) / 10000; // 1% fee
            let burn_amount = BURN_AMOUNT - fee_amount;
            
            // Verify metadata was updated
            assert_eq(meme_coin::get_circulating_supply(&metadata), initial_circulating - BURN_AMOUNT);
            assert_eq(meme_coin::get_burned_supply(&metadata), initial_burned + burn_amount);
            
            // Return treasury cap and metadata
            transfer::public_transfer(treasury_cap, CREATOR);
            ts::return_shared(metadata);
        };
        
        ts::end(scenario);
    }
    
    #[test]
    fun test_update_dex_listing() {
        let scenario = setup_coin();
        
        // Update DEX listing
        {
            ts::next_tx(&mut scenario, CREATOR);
            
            // Take metadata
            let metadata = ts::take_shared<MemeCoinMetadata>(&scenario);
            
            // Create a fake DEX pool ID
            let dex_pool_id = @0xDEADBEEF;
            
            // Update DEX listing
            meme_coin::update_dex_listing(
                &mut metadata,
                dex_pool_id,
                ts::ctx(&mut scenario)
            );
            
            // Verify metadata was updated
            assert_eq(meme_coin::is_dex_listed(&metadata), true);
            assert_eq(meme_coin::get_dex_pool_id(&metadata), dex_pool_id);
            
            // Return metadata
            ts::return_shared(metadata);
        };
        
        ts::end(scenario);
    }
    
    #[test]
    #[expected_failure(abort_code = meme_coin::EUnauthorized)]
    fun test_update_dex_listing_unauthorized() {
        let scenario = setup_coin();
        
        // Try to update DEX listing as non-creator
        {
            ts::next_tx(&mut scenario, USER);
            
            // Take metadata
            let metadata = ts::take_shared<MemeCoinMetadata>(&scenario);
            
            // Create a fake DEX pool ID
            let dex_pool_id = @0xDEADBEEF;
            
            // This should fail because USER is not the creator
            meme_coin::update_dex_listing(
                &mut metadata,
                dex_pool_id,
                ts::ctx(&mut scenario)
            );
            
            // Return metadata
            ts::return_shared(metadata);
        };
        
        ts::end(scenario);
    }
}
