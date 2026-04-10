'use client';
import { useEffect } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import { getInbox, createInboxItem, processInboxItem, deleteInboxItem } from '@/lib/api';
import { useActiveDate, todayISO } from '@/hooks/useActiveDate';

export function useInbox() {
  const { inboxItems, setInboxItems, addInboxItem, removeInboxItem } = useDashboardStore();
  const { date: activeDate, isToday } = useActiveDate();

  useEffect(() => {
    getInbox().then((data) => {
      if (data) setInboxItems(data);
    });
  }, []);

  // Mind Log lives in The Stream: captures made while viewing a non-today
  // date are tagged with `captured_for` so the thought is associated with the
  // active day the user was reflecting on — not the current wall-clock day.
  // The inbox queue itself stays global (processed/unprocessed) because
  // the backend doesn't partition items by day.
  async function capture(content: string) {
    const metadata = isToday ? undefined : { captured_for: activeDate };
    const created = await createInboxItem(content, metadata);
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

  return { items: inboxItems, capture, process, remove, activeDate, isToday };
}

// Re-export for sections that want the raw today string without the hook.
export { todayISO };
