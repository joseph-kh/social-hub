import './cryptoSetup'

import { config, isSequenceConfigured as envConfigured } from '@/config/env'
import { logger } from '@/utils/logger'
import type { SecureStoreBackend, SequenceWaaS } from '@0xsequence/waas'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'

let SequenceWaaSClass: typeof SequenceWaaS | null = null

try {
  SequenceWaaSClass = (
    require('@0xsequence/waas') as typeof import('@0xsequence/waas')
  ).SequenceWaaS
} catch (error) {
  logger.warn('SequenceWaaS import failed:', error)
}

class ExpoSecureStoreBackend implements SecureStoreBackend {
  private getKey(dbName: string, dbStoreName: string, key: string): string {
    return `${dbName}-${dbStoreName}-${key}`
  }

  async get(
    dbName: string,
    dbStoreName: string,
    key: string
  ): Promise<string | null> {
    const fullKey = this.getKey(dbName, dbStoreName, key)
    try {
      const value = await SecureStore.getItemAsync(fullKey)
      return value ? JSON.parse(value) : null
    } catch (error) {
      logger.error('SecureStore get failed:', fullKey, error)
      return null
    }
  }

  async set(
    dbName: string,
    dbStoreName: string,
    key: string,
    value: string
  ): Promise<boolean> {
    const fullKey = this.getKey(dbName, dbStoreName, key)
    try {
      await SecureStore.setItemAsync(fullKey, JSON.stringify(value))
      return true
    } catch (error) {
      logger.error('SecureStore set failed:', fullKey, error)
      return false
    }
  }

  async delete(
    dbName: string,
    dbStoreName: string,
    key: string
  ): Promise<boolean> {
    const fullKey = this.getKey(dbName, dbStoreName, key)
    try {
      await SecureStore.deleteItemAsync(fullKey)
      return true
    } catch (error) {
      logger.error('SecureStore delete failed:', fullKey, error)
      return false
    }
  }
}

const localStorage = {
  get: async (key: string) => {
    try {
      return (await AsyncStorage.getItem(key)) ?? null
    } catch {
      return null
    }
  },
  set: async (key: string, value: string | null) => {
    try {
      if (value === null) {
        await AsyncStorage.removeItem(key)
        return
      }
      await AsyncStorage.setItem(key, value)
    } catch {
      logger.warn('AsyncStorage set failed for key:', key)
    }
  },
}

export const isSequenceConfigured = envConfigured && SequenceWaaSClass !== null

let sequenceWaasInstance: SequenceWaaS | null = null

if (isSequenceConfigured && SequenceWaaSClass !== null) {
  try {
    sequenceWaasInstance = new SequenceWaaSClass(
      {
        network: 'avalanche',
        projectAccessKey: config.sequenceProjectAccessKey,
        waasConfigKey: config.sequenceWaasConfigKey,
      },
      localStorage,
      null,
      new ExpoSecureStoreBackend()
    )
    logger.info('Sequence WaaS client initialized')
  } catch (error) {
    logger.warn('Sequence WaaS client creation failed:', error)
  }
}

export const sequenceWaas = sequenceWaasInstance
