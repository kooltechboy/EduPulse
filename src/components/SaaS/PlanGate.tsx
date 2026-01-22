import React, { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import UpgradePrompt from './UpgradePrompt';
import { Loader2 } from 'lucide-react';

export type PlanTier = 'free' | 'basic' | 'premium' | 'enterprise';

const PLAN_HIERARCHY: Record<PlanTier, number> = {
    'free': 0,
    'basic': 1,
    'premium': 2,
    'enterprise': 3
};

interface PlanGateProps {
    children: ReactNode;
    minPlan: PlanTier;
    featureName?: string;
    fallback?: ReactNode;
}

const PlanGate: React.FC<PlanGateProps> = ({
    children,
    minPlan,
    featureName,
    fallback
}) => {
    const { school, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="animate-spin text-slate-300" />
            </div>
        );
    }

    // Default to free if no school context (e.g. dev mode or error)
    const currentPlan = (school?.subscriptionPlan as PlanTier) || 'free';

    const currentLevel = PLAN_HIERARCHY[currentPlan] || 0;
    const requiredLevel = PLAN_HIERARCHY[minPlan] || 0;

    if (currentLevel < requiredLevel) {
        return fallback || <UpgradePrompt featureName={featureName} requiredPlan={minPlan} />;
    }

    return <>{children}</>;
};

export default PlanGate;
