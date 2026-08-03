// Re-export useAuth from the main auth context
// Multiple pages import from '@/lib/hooks/use-auth' which maps here
export { useAuth, type UserRole } from '@/contexts/auth-context';
