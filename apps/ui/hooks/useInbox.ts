'use client';
import { useEffect } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import { getInbox, createInboxItem, processInboxItem, deleteInboxItem } from '@/lib/api';

export function useInbox() {
  const { inboxItems, setInboxItems, addInboxItem, removeInboxItem } = useDashboardStore();

  useEffect(() => {
    getInbox().then((data) => {
      if (data) setInboxItems(data);
    });
  }, []);

  async function capture(content: string) {
    const created = await createInboxItem(content);
    if (created) addInboxItem(created);
  }

  async function process(id: string, routed_to?: string) {
    removeInboxItem(id);
    await processInboxItem(id, routed_to);
  }

  async function remove(id: string) {
    removeInboxItem(id);
    deleteInboxItem(id);
  }

  return { items: inboxItems, capture, process, remove };
}
