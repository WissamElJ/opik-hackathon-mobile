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
}

export const agenticApi = new AgenticApiService();
