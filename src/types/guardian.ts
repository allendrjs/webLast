// GuardianController's GET endpoint returns the raw JPA entity, same as
// Enrollment - the real shape now lives in common.ts (shared with
// enrollment.ts's Student.guardians) so it's defined in exactly one place.
export type { Guardian } from "./common";
