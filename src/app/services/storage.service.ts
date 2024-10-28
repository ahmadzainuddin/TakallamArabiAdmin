import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  // Add an array of strings to storage
  async addItem(key: string, value: string[]): Promise<void> {
    await Preferences.set({ key, value: JSON.stringify(value) });
  }

  // Get all stored items
  async getAllItems(): Promise<{ key: string; value: string[] }[]> {
    const { keys } = await Preferences.keys();
    const items = [];
    for (const key of keys) {
      const { value } = await Preferences.get({ key });
      if (value) items.push({ key, value: JSON.parse(value) }); // Ensure value is parsed as string[]
    }
    items.sort((a, b) => {
      return b.key.localeCompare(a.key);
    });
    // console.log(items);
    return items;
  }

    // Delete an item from storage
    async deleteItem(key: string): Promise<void> {
      await Preferences.remove({ key });
    }

    // Clear all storage data
    async clearAll(): Promise<void> {
      await Preferences.clear();
    }
}
