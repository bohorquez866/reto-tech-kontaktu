export type ChannelKind =
  | "voice"
  | "whatsapp"
  | "web"
  | "meta"
  | "import"
  | "crm"
  | "email"
  | "unknown";

export type RawInteraction = {
  id: string;
  channel: string | null;
  direction: string | null;
  created_at: string | number | null;
  content: string | null;
  metadata: Record<string, unknown> | null;
};

export type RawContact = {
  id: string;
  organization_id: string;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  lead_source: string | null;
  contact_type: string | null;
  created_at: string | number | null;
  ai_handoff?: boolean;
  handoff_reason?: string | null;
  handoff_requested_at?: string | null;
  is_test?: boolean;
  assigned_agent_id?: string | null;
  matching_enabled?: boolean;
  tags?: string[] | null;
  notes?: string | null;
  qualification_data: unknown;
  interest_preferences?: unknown;
  interactions?: RawInteraction[] | null;
};

export type ContactsExport = {
  organization: { id: string; name: string };
  contacts: RawContact[];
};

export type PhoneView = {
  raw: string;
  e164: string | null;
  display: string;
  whatsappUrl: string | null;
  telUrl: string | null;
};

export type EmailView = {
  raw: string;
  valid: boolean;
  display: string;
};

export type SourceView = {
  raw: string | null;
  label: string;
  channel: ChannelKind;
};

export type FactView = {
  key: string;
  label: string;
  value: unknown;
  displayValue: string;
  provenance: "client" | "agent" | "unknown";
  provenanceLabel: string;
  updatedAtLabel: string;
  confidence: string | null;
};

export type QualificationGroupId = "sale" | "rental" | "shared" | "other";

export type QualificationGroup = {
  id: QualificationGroupId;
  label: string;
  facts: FactView[];
};

export type InteractionView = {
  id: string;
  channel: ChannelKind;
  channelLabel: string;
  direction: string | null;
  createdAt: number | null;
  createdAtLabel: string;
  content: string | null;
  durationSec: number | null;
  transcript: string | null;
  propertyRef: string | null;
  form: string | null;
};

export type DuplicateView = {
  id: string;
  displayName: string;
  reason: string;
};

export type ComplianceView = {
  canCall: boolean;
  canWhatsApp: boolean;
  canEmail: boolean;
  blocked: boolean;
  reasons: string[];
};

export type ContactViewModel = {
  id: string;
  organizationId: string;
  isWrongOrg: boolean;
  displayName: string;
  initials: string;
  phone: PhoneView | null;
  email: EmailView | null;
  source: SourceView;
  createdAtLabel: string;
  qualification: QualificationGroup[];
  interactions: InteractionView[];
  lastInteraction: { channelLabel: string; createdAtLabel: string } | null;
  compliance: ComplianceView;
  duplicates: DuplicateView[];
  flags: {
    isTest: boolean;
    isHandoff: boolean;
    handoffReason: string | null;
  };
  notes: string | null;
};

export type ContactListItem = {
  id: string;
  displayName: string;
  initials: string;
  source: SourceView;
  lastInteraction: { channelLabel: string; createdAtLabel: string } | null;
  isTest: boolean;
  isWrongOrg: boolean;
  isDoNotCall: boolean;
};
