import { SuiClient, getFullnodeUrl } from '@mysten/sui/client'
import { SuiEvent } from '@mysten/sui/client'
import logger from '../utils/logger'
import eventProcessor from './eventProcessor'

class SuiListener {
  private suiClient: SuiClient
  private isRunning: boolean = false
  private checkIntervalMs: number = 5000 // 5 seconds
  private intervalId: NodeJS.Timeout | null = null
  private lastProcessedCheckpoint: bigint | null = null
  
  constructor() {
    const rpcUrl = process.env.SUI_RPC_URL || getFullnodeUrl('mainnet')
    this.suiClient = new SuiClient({ url: rpcUrl })
  }
  
  /**
   * Start listening for events
   */
  async start() {
    if (this.isRunning) {
      logger.warn('SuiListener is already running')
      return
    }
    
    logger.info('Starting SuiListener...')
    this.isRunning = true
    
    try {
      // Get the latest checkpoint to start from
      const latestCheckpoint = BigInt(await this.suiClient.getLatestCheckpointSequenceNumber())
      this.lastProcessedCheckpoint = latestCheckpoint
      
      logger.info(`Starting from checkpoint: ${this.lastProcessedCheckpoint}`)
      
      // Start polling for new events
      this.intervalId = setInterval(() => this.pollEvents(), this.checkIntervalMs)
      
      logger.info('SuiListener started successfully')
    } catch (error) {
      logger.error('Failed to start SuiListener:', error)
      this.isRunning = false
    }
  }
  
  /**
   * Stop listening for events
   */
  stop() {
    if (!this.isRunning || !this.intervalId) {
      logger.warn('SuiListener is not running')
      return
    }
    
    clearInterval(this.intervalId)
    this.intervalId = null
    this.isRunning = false
    logger.info('SuiListener stopped')
  }
  
  /**
   * Poll for new events
   */
  private async pollEvents() {
    if (this.lastProcessedCheckpoint === null) {
      logger.error('No last processed checkpoint')
      return
    }
    
    try {
      // Get the latest checkpoint
      const latestCheckpoint = BigInt(await this.suiClient.getLatestCheckpointSequenceNumber())

      // If there are no new checkpoints, skip
      if (latestCheckpoint <= this.lastProcessedCheckpoint) {
        return
      }

      logger.info(`Processing checkpoints from ${this.lastProcessedCheckpoint + 1n} to ${latestCheckpoint}`)
      
      // Query events for our package
      const packageId = process.env.PACKAGE_ID
      
      if (!packageId) {
        logger.warn('PACKAGE_ID not set, skipping event processing')
        this.lastProcessedCheckpoint = latestCheckpoint
        return
      }
      
      // Query for events from our package
      const events = await this.suiClient.queryEvents({
        query: {
          MoveEventModule: {
            package: packageId,
            module: 'meme_coin'
          }
        },
        limit: 50
      })
      
      // Process events
      if (events.data.length > 0) {
        logger.info(`Found ${events.data.length} events to process`)
        await this.processEvents(events.data)
      }
      
      // Update last processed checkpoint
      this.lastProcessedCheckpoint = latestCheckpoint
    } catch (error) {
      logger.error('Error polling events:', error)
    }
  }
  
  /**
   * Process events
   */
  private async processEvents(events: SuiEvent[]) {
    for (const event of events) {
      try {
        await eventProcessor.processEvent(event)
      } catch (error) {
        logger.error(`Error processing event ${event.id}:`, error)
      }
    }
  }
}

export default new SuiListener()
