#[test_only]
module meme_coin_platform::dex_integration_test {
    use std::string;
    use sui::test_scenario::{Self as ts, Scenario};
    use sui::coin::{Self, Coin, TreasuryCap};
    use sui::sui::SUI;
    use sui::test_utils::{assert_eq};
    use sui::transfer;
    use sui::object::{Self, ID};
    
    use meme_coin_platform::dex_integration::{Self, BondingCurvePool, CetusDexPool};
    use meme_coin_platform::meme_coin::{Self, MemeCoinMetadata};
    
    // Test coin type
    struct TEST_COIN has drop {}
    
    // Test addresses
    const CREATOR: address = @0xCAFE;
    const BUYER: address = @0xFACE;
    const SELLER: address = @0xBEEF;
    
    // Test constants
    const INITIAL_SUI_AMOUNT: u64 = 1_000_000_000; // 1,000 SUI
    const INITIAL_TOKEN_AMOUNT: u64 = 1_000_000_000; // 1B tokens
    const FEE_PERCENT: u64 = 30; // 0.3%
    
    // Helper function to set up a test scenario with a bonding curve pool
    fun setup_pool(): Scenario {
        // Start test scenario with creator
        let scenario = ts::begin(CREATOR);
        
        // Create test coin
        {
            let ctx = ts::ctx(&mut scenario);
            
            // Create test coin
            let (treasury_cap, coin_metadata) = coin::create_currency(
                TEST_COIN {},
                9,
                b"TEST",
                b"Test Coin",
                b"A test coin for DEX integration",
                option::none(),
                ctx
            );
            
            // Mint initial supply
            let initial_coins = coin::mint(&mut treasury_cap, INITIAL_TOKEN_AMOUNT, ctx);
            
            // Create SUI coin for pool
            let sui_coin = coin::mint_for_testing<SUI>(INITIAL_SUI_AMOUNT, ctx);
            
            // Create bonding curve pool
            dex_integration::create_pool<TEST_COIN>(
                sui_coin,
                initial_coins,
                FEE_PERCENT,
                b"TEST_COIN",
                ctx
            );
            
            // Transfer treasury cap to creator
            transfer::public_transfer(treasury_cap, CREATOR);
            transfer::public_transfer(coin_metadata, CREATOR);
        };
        
        scenario
    }
    
    #[test]
    fun test_create_pool() {
        let scenario = setup_pool();
        
        // Verify pool was created
        {
            ts::next_tx(&mut scenario, CREATOR);
            
            // Check that pool exists
            assert!(ts::has_most_recent_shared<BondingCurvePool<TEST_COIN>>(), 0);
            
            // Get pool
            let pool = ts::take_shared<BondingCurvePool<TEST_COIN>>(&scenario);
            
            // Verify pool properties
            assert_eq(dex_integration::get_creator(&pool), CREATOR);
            assert_eq(dex_integration::get_fee_percent(&pool), FEE_PERCENT);
            assert_eq(dex_integration::get_sui_balance(&pool), INITIAL_SUI_AMOUNT);
            assert_eq(dex_integration::get_token_balance(&pool), INITIAL_TOKEN_AMOUNT);
            assert_eq(dex_integration::get_market_cap(&pool), INITIAL_SUI_AMOUNT);
            assert_eq(dex_integration::is_dex_listed(&pool), false);
            
            // Return pool
            ts::return_shared(pool);
        };
        
        ts::end(scenario);
    }
    
    #[test]
    fun test_buy_tokens() {
        let scenario = setup_pool();
        
        // Buy tokens
        {
            ts::next_tx(&mut scenario, BUYER);
            
            // Get pool
            let pool = ts::take_shared<BondingCurvePool<TEST_COIN>>(&scenario);
            
            // Create SUI coin for purchase
            let sui_coin = coin::mint_for_testing<SUI>(100_000_000, ts::ctx(&mut scenario)); // 100 SUI
            
            // Buy tokens
            let token_coin = dex_integration::buy<TEST_COIN>(
                &mut pool,
                sui_coin,
                0, // Min tokens out (no slippage protection for test)
                ts::ctx(&mut scenario)
            );
            
            // Verify token amount received
            let token_amount = coin::value(&token_coin);
            assert!(token_amount > 0, 0);
            
            // Verify market cap increased
            let new_market_cap = dex_integration::get_market_cap(&pool);
            assert!(new_market_cap > INITIAL_SUI_AMOUNT, 0);
            
            // Transfer token to buyer
            transfer::public_transfer(token_coin, BUYER);
            
            // Return pool
            ts::return_shared(pool);
        };
        
        ts::end(scenario);
    }
    
    #[test]
    fun test_sell_tokens() {
        let scenario = setup_pool();
        
        // First buy tokens
        let token_id: ID;
        {
            ts::next_tx(&mut scenario, SELLER);
            
            // Get pool
            let pool = ts::take_shared<BondingCurvePool<TEST_COIN>>(&scenario);
            
            // Create SUI coin for purchase
            let sui_coin = coin::mint_for_testing<SUI>(100_000_000, ts::ctx(&mut scenario)); // 100 SUI
            
            // Buy tokens
            let token_coin = dex_integration::buy<TEST_COIN>(
                &mut pool,
                sui_coin,
                0, // Min tokens out (no slippage protection for test)
                ts::ctx(&mut scenario)
            );
            
            // Save token ID
            token_id = object::id(&token_coin);
            
            // Transfer token to seller
            transfer::public_transfer(token_coin, SELLER);
            
            // Return pool
            ts::return_shared(pool);
        };
        
        // Then sell tokens
        {
            ts::next_tx(&mut scenario, SELLER);
            
            // Get pool
            let pool = ts::take_shared<BondingCurvePool<TEST_COIN>>(&scenario);
            
            // Take token coin
            let token_coin = ts::take_from_address<Coin<TEST_COIN>>(&scenario, SELLER, token_id);
            
            // Get token amount
            let token_amount = coin::value(&token_coin);
            
            // Sell tokens
            let sui_coin = dex_integration::sell<TEST_COIN>(
                &mut pool,
                token_coin,
                0, // Min SUI out (no slippage protection for test)
                ts::ctx(&mut scenario)
            );
            
            // Verify SUI amount received
            let sui_amount = coin::value(&sui_coin);
            assert!(sui_amount > 0, 0);
            
            // Transfer SUI to seller
            transfer::public_transfer(sui_coin, SELLER);
            
            // Return pool
            ts::return_shared(pool);
        };
        
        ts::end(scenario);
    }
    
    #[test]
    fun test_create_cetus_pool() {
        let scenario = setup_pool();
        
        // First make the pool eligible for DEX listing by increasing market cap
        {
            ts::next_tx(&mut scenario, BUYER);
            
            // Get pool
            let pool = ts::take_shared<BondingCurvePool<TEST_COIN>>(&scenario);
            
            // Create SUI coin for purchase - large enough to reach threshold
            let sui_coin = coin::mint_for_testing<SUI>(70_000_000_000, ts::ctx(&mut scenario)); // 70,000 SUI
            
            // Buy tokens
            let token_coin = dex_integration::buy<TEST_COIN>(
                &mut pool,
                sui_coin,
                0, // Min tokens out (no slippage protection for test)
                ts::ctx(&mut scenario)
            );
            
            // Transfer token to buyer
            transfer::public_transfer(token_coin, BUYER);
            
            // Return pool
            ts::return_shared(pool);
        };
        
        // Then create Cetus pool
        {
            ts::next_tx(&mut scenario, CREATOR);
            
            // Get pool
            let pool = ts::take_shared<BondingCurvePool<TEST_COIN>>(&scenario);
            
            // Create additional liquidity
            let sui_coin = coin::mint_for_testing<SUI>(10_000_000_000, ts::ctx(&mut scenario)); // 10,000 SUI
            let token_coin = coin::mint_for_testing<TEST_COIN>(10_000_000_000, ts::ctx(&mut scenario)); // 10B tokens
            
            // Check eligibility
            assert!(dex_integration::check_dex_eligibility(&pool), 0);
            
            // Create Cetus pool
            dex_integration::create_cetus_pool<TEST_COIN>(
                &mut pool,
                sui_coin,
                token_coin,
                ts::ctx(&mut scenario)
            );
            
            // Verify pool is now DEX listed
            assert!(dex_integration::is_dex_listed(&pool), 0);
            
            // Verify CetusDexPool was created
            assert!(ts::has_most_recent_shared<CetusDexPool<TEST_COIN>>(), 0);
            
            // Return pool
            ts::return_shared(pool);
        };
        
        ts::end(scenario);
    }
}
