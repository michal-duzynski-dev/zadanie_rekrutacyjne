import type { DataItem } from "../types/data.types";

class DataService {
  private baseUrl: string = "api/Data";

  async getData(userId: string): Promise<DataItem> {
    try {
      const response = await fetch(this.baseUrl + `/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }
}

export const dataService = new DataService();
