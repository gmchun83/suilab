import { SuiEvent } from '@mysten/sui.js/client'
import { PrismaClient } from '@prisma/client'
import logger from '../utils/logger'
import notificationService from '../services/notificationService'

const prisma = new PrismaClient()

class EventProcessor {
  /**
   * Process a Sui event
   */
  async processEvent(event: SuiEvent) {
    const eventType = event.type

    logger.info(`Processing event of type: ${eventType}`)

    // Handle different event types
    if (eventType.includes('CoinCreatedEvent')) {
      await this.processCoinCreatedEvent(event)
    } else if (eventType.includes('CoinBoughtEvent')) {
      await this.processCoinBoughtEvent(event)
    } else if (eventType.includes('CoinSoldEvent')) {
      await this.processCoinSoldEvent(event)
    } else if (eventType.includes('CoinBurnedEvent')) {
      await this.processCoinBurnedEvent(event)
    } else if (eventType.includes('PoolCreatedEvent')) {
      await this.processPoolCreatedEvent(event)
    } else if (eventType.includes('SwapEvent')) {
      await this.processSwapEvent(event)
    } else if (eventType.includes('DexListingEvent')) {
      await this.processDexListingEvent(event)
    } else {
      logger.info(`Ignoring unhandled event type: ${eventType}`)
    }
  }

  /**
   * Process coin creation event
   */
  private async processCoinCreatedEvent(event: SuiEvent) {
    try {
      const { coin_id, name, symbol, creator, initial_supply } = event.parsedJson as any

      logger.info(`Processing coin creation: ${name} (${symbol})`)

      // Create coin in database
      const coin = await prisma.coin.create({
        data: {
          objectId: coin_id,
          name,
          symbol,
          creatorAddress: creator,
          supply: initial_supply.toString(),
          price: 0.000001, // Initial price
          description: `${name} is a meme coin on the Sui blockchain.`,
          createdAt: new Date(Number(event.timestampMs))
        }
      })

      // Send notification
      notificationService.notifyCoinCreated({
        id: coin.id,
        objectId: coin.objectId,
        name: coin.name,
        symbol: coin.symbol,
        creatorAddress: coin.creatorAddress,
        supply: coin.supply,
        price: coin.price
      })

      logger.info(`Coin created in database: ${coin.id}`)
    } catch (error) {
      logger.error('Error processing coin creation event:', error)
      throw error
    }
  }

  /**
   * Process coin buy event
   */
  private async processCoinBoughtEvent(event: SuiEvent) {
    try {
      const { coin_id, buyer, amount, price } = event.parsedJson as any

      logger.info(`Processing buy transaction for coin: ${coin_id}`)

      // Find the coin
      const coin = await prisma.coin.findFirst({
        where: { objectId: coin_id }
      })

      if (!coin) {
        logger.error(`Coin not found for objectId: ${coin_id}`)
        return
      }

      // Create transaction record
      const transaction = await prisma.transaction.create({
        data: {
          txId: event.id.txDigest,
          coinId: coin.id,
          type: 'BUY',
          amount: amount.toString(),
          price: Number(price) / 1_000_000_000, // Convert from SUI to decimal
          walletAddress: buyer,
          timestamp: new Date(Number(event.timestampMs))
        }
      })

      // Update coin price
      await prisma.coin.update({
        where: { id: coin.id },
        data: { price: Number(price) / 1_000_000_000 }
      })

      // Send notification
      notificationService.notifyTransaction(coin.id, {
        id: transaction.id,
        txId: transaction.txId,
        coinId: transaction.coinId,
        type: transaction.type,
        amount: transaction.amount,
        price: transaction.price,
        walletAddress: transaction.walletAddress,
        timestamp: transaction.timestamp
      })

      logger.info(`Buy transaction processed: ${transaction.id}`)
    } catch (error) {
      logger.error('Error processing buy event:', error)
      throw error
    }
  }

  /**
   * Process coin sell event
   */
  private async processCoinSoldEvent(event: SuiEvent) {
    try {
      const { coin_id, seller, amount, price } = event.parsedJson as any

      logger.info(`Processing sell transaction for coin: ${coin_id}`)

      // Find the coin
      const coin = await prisma.coin.findFirst({
        where: { objectId: coin_id }
      })

      if (!coin) {
        logger.error(`Coin not found for objectId: ${coin_id}`)
        return
      }

      // Create transaction record
      const transaction = await prisma.transaction.create({
        data: {
          txId: event.id.txDigest,
          coinId: coin.id,
          type: 'SELL',
          amount: amount.toString(),
          price: Number(price) / 1_000_000_000, // Convert from SUI to decimal
          walletAddress: seller,
          timestamp: new Date(Number(event.timestampMs))
        }
      })

      // Update coin price
      await prisma.coin.update({
        where: { id: coin.id },
        data: { price: Number(price) / 1_000_000_000 }
      })

      // Send notification
      notificationService.notifyTransaction(coin.id, {
        id: transaction.id,
        txId: transaction.txId,
        coinId: transaction.coinId,
        type: transaction.type,
        amount: transaction.amount,
        price: transaction.price,
        walletAddress: transaction.walletAddress,
        timestamp: transaction.timestamp
      })

      logger.info(`Sell transaction processed: ${transaction.id}`)
    } catch (error) {
      logger.error('Error processing sell event:', error)
      throw error
    }
  }

  /**
   * Process coin burn event
   */
  private async processCoinBurnedEvent(event: SuiEvent) {
    try {
      const { coin_id, burner, amount } = event.parsedJson as any

      logger.info(`Processing burn transaction for coin: ${coin_id}`)

      // Find the coin
      const coin = await prisma.coin.findFirst({
        where: { objectId: coin_id }
      })

      if (!coin) {
        logger.error(`Coin not found for objectId: ${coin_id}`)
        return
      }

      // Create transaction record
      const transaction = await prisma.transaction.create({
        data: {
          txId: event.id.txDigest,
          coinId: coin.id,
          type: 'BURN',
          amount: amount.toString(),
          price: coin.price, // Use current price
          walletAddress: burner,
          timestamp: new Date(Number(event.timestampMs))
        }
      })

      // Update coin supply
      const newSupply = BigInt(coin.supply) - BigInt(amount)
      await prisma.coin.update({
        where: { id: coin.id },
        data: { supply: newSupply }
      })

      // Send notification
      notificationService.notifyTransaction(coin.id, {
        id: transaction.id,
        txId: transaction.txId,
        coinId: transaction.coinId,
        type: transaction.type,
        amount: transaction.amount,
        price: transaction.price,
        walletAddress: transaction.walletAddress,
        timestamp: transaction.timestamp
      })

      logger.info(`Burn transaction processed: ${transaction.id}`)
    } catch (error) {
      logger.error('Error processing burn event:', error)
      throw error
    }
  }

  /**
   * Process pool creation event
   */
  private async processPoolCreatedEvent(event: SuiEvent) {
    try {
      const { pool_id, coin_type, initial_sui, initial_tokens, creator } = event.parsedJson as any

      logger.info(`Processing pool creation: ${pool_id} for coin type ${coin_type}`)

      // Find the coin by type
      const coin = await prisma.coin.findFirst({
        where: { symbol: coin_type }
      })

      if (!coin) {
        logger.info(`Coin not found for type: ${coin_type}, may be created later`)
        return
      }

      // Create pool record
      const pool = await prisma.pool.create({
        data: {
          objectId: pool_id,
          coinId: coin.id,
          type: 'BONDING_CURVE',
          suiBalance: initial_sui.toString(),
          tokenBalance: initial_tokens.toString(),
          creatorAddress: creator,
          createdAt: new Date(Number(event.timestampMs))
        }
      })

      // Update coin with pool info
      await prisma.coin.update({
        where: { id: coin.id },
        data: {
          poolId: pool.id,
          price: Number(initial_sui) / Number(initial_tokens) // Initial price
        }
      })

      // Send notification
      notificationService.notifyPoolCreated({
        id: pool.id,
        objectId: pool.objectId,
        coinId: pool.coinId,
        type: pool.type,
        suiBalance: pool.suiBalance,
        tokenBalance: pool.tokenBalance,
        creatorAddress: pool.creatorAddress
      })

      logger.info(`Pool created in database: ${pool.id}`)
    } catch (error) {
      logger.error('Error processing pool creation event:', error)
      throw error
    }
  }

  /**
   * Process swap event
   */
  private async processSwapEvent(event: SuiEvent) {
    try {
      const { pool_id, trader, sui_amount, token_amount, is_buy } = event.parsedJson as any

      logger.info(`Processing swap event for pool: ${pool_id}`)

      // Find the pool
      const pool = await prisma.pool.findFirst({
        where: { objectId: pool_id }
      })

      if (!pool) {
        logger.error(`Pool not found for objectId: ${pool_id}`)
        return
      }

      // Find the coin
      const coin = await prisma.coin.findUnique({
        where: { id: pool.coinId }
      })

      if (!coin) {
        logger.error(`Coin not found for pool: ${pool_id}`)
        return
      }

      // Create transaction record
      const transaction = await prisma.transaction.create({
        data: {
          txId: event.id.txDigest,
          coinId: coin.id,
          type: is_buy ? 'BUY' : 'SELL',
          amount: token_amount.toString(),
          price: Number(sui_amount) / Number(token_amount), // Calculate price
          walletAddress: trader,
          timestamp: new Date(Number(event.timestampMs))
        }
      })

      // Update pool balances
      if (is_buy) {
        // Buy: SUI in, tokens out
        const newSuiBalance = BigInt(pool.suiBalance) + BigInt(sui_amount)
        const newTokenBalance = BigInt(pool.tokenBalance) - BigInt(token_amount)

        await prisma.pool.update({
          where: { id: pool.id },
          data: {
            suiBalance: newSuiBalance.toString(),
            tokenBalance: newTokenBalance.toString()
          }
        })
      } else {
        // Sell: tokens in, SUI out
        const newSuiBalance = BigInt(pool.suiBalance) - BigInt(sui_amount)
        const newTokenBalance = BigInt(pool.tokenBalance) + BigInt(token_amount)

        await prisma.pool.update({
          where: { id: pool.id },
          data: {
            suiBalance: newSuiBalance.toString(),
            tokenBalance: newTokenBalance.toString()
          }
        })
      }

      // Update coin price
      const newPrice = Number(sui_amount) / Number(token_amount)
      await prisma.coin.update({
        where: { id: coin.id },
        data: { price: newPrice }
      })

      // Send notification
      notificationService.notifyTransaction(coin.id, {
        id: transaction.id,
        txId: transaction.txId,
        coinId: transaction.coinId,
        type: transaction.type,
        amount: transaction.amount,
        price: transaction.price,
        walletAddress: transaction.walletAddress,
        timestamp: transaction.timestamp
      })

      // Also send price update notification
      notificationService.notifyPriceUpdate(coin.id, {
        coinId: coin.id,
        price: newPrice,
        timestamp: new Date(Number(event.timestampMs))
      })

      logger.info(`Swap transaction processed: ${transaction.id}`)
    } catch (error) {
      logger.error('Error processing swap event:', error)
      throw error
    }
  }

  /**
   * Process DEX listing event
   */
  private async processDexListingEvent(event: SuiEvent) {
    try {
      const { bonding_pool_id, dex_pool_id, coin_type, sui_amount, token_amount, market_cap } = event.parsedJson as any

      logger.info(`Processing DEX listing for pool: ${bonding_pool_id} to DEX pool: ${dex_pool_id}`)

      // Find the bonding pool
      const bondingPool = await prisma.pool.findFirst({
        where: { objectId: bonding_pool_id }
      })

      if (!bondingPool) {
        logger.error(`Bonding pool not found for objectId: ${bonding_pool_id}`)
        return
      }

      // Find the coin
      const coin = await prisma.coin.findUnique({
        where: { id: bondingPool.coinId }
      })

      if (!coin) {
        logger.error(`Coin not found for pool: ${bonding_pool_id}`)
        return
      }

      // Create DEX pool record
      const dexPool = await prisma.pool.create({
        data: {
          objectId: dex_pool_id,
          coinId: coin.id,
          type: 'DEX',
          suiBalance: sui_amount.toString(),
          tokenBalance: token_amount.toString(),
          creatorAddress: bondingPool.creatorAddress,
          createdAt: new Date(Number(event.timestampMs))
        }
      })

      // Update coin with DEX info
      await prisma.coin.update({
        where: { id: coin.id },
        data: {
          dexPoolId: dexPool.id,
          dexListed: true,
          marketCap: market_cap.toString()
        }
      })

      // Send notification
      notificationService.notifyDexListing({
        coinId: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        bondingPoolId: bondingPool.id,
        dexPoolId: dexPool.id,
        marketCap: market_cap.toString()
      })

      logger.info(`DEX listing processed for coin: ${coin.id}`)
    } catch (error) {
      logger.error('Error processing DEX listing event:', error)
      throw error
    }
  }
}

export default new EventProcessor()
