import type { ChatChannel, ChatMessageSnapshot, NotificationSnapshot } from "@obsidian-astral/shared";

export type CommunicationSection = "global" | "workshop" | "mails" | "alerts";

export interface CommunicationMenuItem {
  key: CommunicationSection;
  label: string;
  icon: string;
  count?: number;
  tone?: "primary" | "secondary" | "danger";
}

export interface CommunicationRosterEntry {
  key: string;
  label: string;
  status: string;
  tone: "primary" | "secondary" | "neutral";
  avatarUrl: string;
}

export function buildCommunicationMenu(unreadCount: number): CommunicationMenuItem[] {
  return [
    { key: "global", label: "Globál chat", icon: "public" },
    { key: "workshop", label: "Műhely chat", icon: "groups" },
    { key: "mails", label: "Neural üzenetek", icon: "neurology", count: unreadCount, tone: "secondary" },
    { key: "alerts", label: "Rendszerjelzések", icon: "warning", tone: "danger" },
  ];
}

export function getCommunicationTitle(section: CommunicationSection) {
  const titles: Record<CommunicationSection, string> = {
    global: "Globál chat",
    workshop: "Műhely chat",
    mails: "Neural üzenetek",
    alerts: "Rendszerjelzések",
  };

  return titles[section];
}

export function getChannelLabel(channel: ChatChannel) {
  return channel === "global" ? "Globál" : "Műhely";
}

export function sortNotifications(notifications: NotificationSnapshot[], query: string, mode: "mails" | "alerts") {
  const normalizedQuery = query.trim().toLowerCase();
  const filteredByMode = notifications.filter((notification) =>
    mode === "alerts" ? notification.kind === "admin" || notification.kind === "rendszer" : notification.kind !== "admin",
  );

  return filteredByMode.filter((notification) => {
    if (!normalizedQuery) {
      return true;
    }

    return `${notification.title} ${notification.body}`.toLowerCase().includes(normalizedQuery);
  });
}

export function sortMessages(messages: ChatMessageSnapshot[], query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  return messages.filter((message) => {
    if (!normalizedQuery) {
      return true;
    }

    return `${message.authorName} ${message.content}`.toLowerCase().includes(normalizedQuery);
  });
}

export function buildCommunicationRoster(): CommunicationRosterEntry[] {
  return [
    {
      key: "cypher-knight",
      label: "Cypher_Knight",
      status: "Online",
      tone: "primary",
      avatarUrl: "/communication/cypher-knight.png",
    },
    {
      key: "mist-walker",
      label: "Mist_Walker",
      status: "Küldetésen",
      tone: "secondary",
      avatarUrl: "/communication/mist-walker.png",
    },
    {
      key: "nova-prime",
      label: "Nova_Prime",
      status: "Elfoglalt",
      tone: "neutral",
      avatarUrl: "/communication/nova-prime.png",
    },
    {
      key: "project-zero",
      label: "Project_Zero",
      status: "Online",
      tone: "primary",
      avatarUrl: "/communication/project-zero.png",
    },
  ];
}

export function buildAttachmentCards(notification: NotificationSnapshot | null) {
  if (!notification) {
    return [];
  }

  return [
    {
      key: `${notification.id}:brief`,
      label: `${notification.kind.toUpperCase()}_BRIEF.vmf`,
      detail: "KAPCSOLÓDÓ ADAT • 4.2 MB",
      icon: "map",
      tone: "primary",
    },
    {
      key: `${notification.id}:signal`,
      label: `SIGNAL_${notification.id.slice(0, 4).toUpperCase()}.log`,
      detail: "TECHNIKAI NAPLÓ • 1.1 MB",
      icon: "insert_chart",
      tone: "secondary",
    },
  ];
}
