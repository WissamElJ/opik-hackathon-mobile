const AGENTIC_API_URL = process.env.EXPO_PUBLIC_AGENTIC_API_URL as string;

export class AgenticApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = AGENTIC_API_URL;
  }

  /**
   * Ping the Agentic API to check if it's up
   * @returns Promise<boolean> - true if API is up (returns 200), false otherwise
   */
  async ping(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.status === 200;
    } catch (error) {
      console.error('Error pinging Agentic API:', error);
      return false;
    }
  }

  /**
   * Sync user metadata to the Agentic API
   * @param metadata - The user metadata object from Supabase session
   * @returns Promise<boolean> - true if sync was successful, false otherwise
   */
  async syncUser(metadata: Record<string, any>): Promise<boolean> {
    try {
      console.log('🔄 Syncing user metadata to API...');
      const response = await fetch(`${this.baseUrl}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metadata),
      });

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      console.log('✅ User metadata synced successfully');
      return true;
    } catch (error) {
      console.error('Error syncing user metadata:', error);
      return false;
    }
  }
}

export const agenticApi = new AgenticApiService();
