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

export interface CommunicationFeedEntry {
  id: string;
  title: string;
  subtitle: string;
  preview: string;
  stamp: string;
  unread: boolean;
  tone: "primary" | "secondary" | "neutral" | "danger";
  avatarUrl: string;
}

const communicationAvatarMap: Record<string, string> = {
  admin: "/communication/commander-vane.png",
  system: "/communication/neural-link-01.png",
  "market bot": "/communication/project-zero.png",
  "cypher_knight": "/communication/cypher-knight.png",
  "mist_walker": "/communication/mist-walker.png",
  "nova_prime": "/communication/nova-prime.png",
  "project_zero": "/communication/project-zero.png",
};

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

export function getCommunicationSearchPlaceholder(section: CommunicationSection) {
  return section === "global" || section === "workshop"
    ? "Lekérdezés a csatornában..."
    : "Lekérdezés a neural feedben...";
}

export function getCommunicationBreadcrumb(section: CommunicationSection) {
  return section === "alerts" ? "Riasztási csatorna" : "Bejövő feed";
}

export function getChannelLabel(channel: ChatChannel) {
  return channel === "global" ? "Globál" : "Műhely";
}

export function getSectionActionLabel(section: CommunicationSection) {
  return section === "global" || section === "workshop" ? "Új átvitel" : "Új üzenet";
}

export function sortNotifications(notifications: NotificationSnapshot[], query: string, mode: "mails" | "alerts") {
  const normalizedQuery = query.trim().toLowerCase();
  const filteredByMode = notifications.filter((notification) =>
    mode === "alerts" ? notification.kind === "admin" || notification.kind === "rendszer" : notification.kind !== "admin",
  );

  return filteredByMode
    .filter((notification) => {
      if (!normalizedQuery) {
        return true;
      }

      return `${notification.title} ${notification.body}`.toLowerCase().includes(normalizedQuery);
    })
    .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt));
}

export function sortMessages(messages: ChatMessageSnapshot[], query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  return [...messages]
    .filter((message) => {
      if (!normalizedQuery) {
        return true;
      }

      return `${message.authorName} ${message.content}`.toLowerCase().includes(normalizedQuery);
    })
    .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt));
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

export function buildNotificationFeedEntries(notifications: NotificationSnapshot[]): CommunicationFeedEntry[] {
  return notifications.map((notification) => ({
    id: notification.id,
    title: notification.title,
    subtitle: notification.kind === "admin" ? "Admin (rendszer)" : formatNotificationKind(notification.kind),
    preview: notification.body,
    stamp: formatStamp(notification.createdAt),
    unread: !notification.readAt,
    tone: getNotificationTone(notification),
    avatarUrl: resolveAvatarUrl(notification.kind === "admin" ? "admin" : "system"),
  }));
}

export function buildChatFeedEntries(messages: ChatMessageSnapshot[]): CommunicationFeedEntry[] {
  return messages.map((message) => ({
    id: message.id,
    title: normalizeIdentityLabel(message.authorName),
    subtitle: "Élő kapcsolat",
    preview: message.content,
    stamp: formatStamp(message.createdAt),
    unread: false,
    tone: "primary",
    avatarUrl: resolveAvatarUrl(message.authorName),
  }));
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

export function formatMailMeta(notification: NotificationSnapshot) {
  return `${formatNotificationKind(notification.kind).toUpperCase()} • ${formatStamp(notification.createdAt)}`;
}

function getNotificationTone(
  notification: NotificationSnapshot,
): CommunicationFeedEntry["tone"] {
  if (notification.kind === "admin") {
    return "danger";
  }

  if (notification.kind === "expedicio") {
    return "secondary";
  }

  if (notification.kind === "gazdasag") {
    return "neutral";
  }

  return "primary";
}

function formatNotificationKind(kind: NotificationSnapshot["kind"]) {
  const labels: Record<NotificationSnapshot["kind"], string> = {
    admin: "Admin",
    expedicio: "Expedíció",
    gazdasag: "Gazdaság",
    rendszer: "Rendszer",
  };

  return labels[kind];
}

function formatStamp(value: string) {
  return new Intl.DateTimeFormat("hu-HU", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function normalizeIdentityLabel(value: string) {
  return value
    .replace(/_/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join("_");
}

function resolveAvatarUrl(value: string) {
  return communicationAvatarMap[normalizeAvatarKey(value)] ?? "/communication/neural-link-01.png";
}

function normalizeAvatarKey(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "_");
}
