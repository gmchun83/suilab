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
        data: { supply: newSupply.toString() }
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
}

export default new EventProcessor()
