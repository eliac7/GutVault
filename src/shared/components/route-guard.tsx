"use client";

import { type ReactNode } from "react";
import { useLock } from "@/shared/providers/lock-provider";
import { LockScreen } from "@/features/settings/ui/lock-screen";

interface RouteGuardProps {
  children: ReactNode;
}

export function RouteGuard({ children }: RouteGuardProps) {
  const { isLocked } = useLock();

  return (
    <>
      {isLocked && <LockScreen />}
      {children}
    </>
  );
}
