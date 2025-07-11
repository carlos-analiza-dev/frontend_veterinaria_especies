import { PermissionStatus } from "@/core/permissions/interface/location-interface";
import { usePermissionsStore } from "@/presentation/auth/store/usePermissions";
import { router } from "expo-router";
import React, { PropsWithChildren, useEffect } from "react";
import { AppState } from "react-native";

const PermissionsCheckerProvider = ({ children }: PropsWithChildren) => {
  const { locationStatus, checkLocationPermission } = usePermissionsStore();

  useEffect(() => {
    if (
      locationStatus === PermissionStatus.DENIED ||
      locationStatus === PermissionStatus.BLOCKED ||
      locationStatus === PermissionStatus.UNDETERMINED
    ) {
      router.replace("/(auth)/location-permission");
    }
  }, [locationStatus]);

  useEffect(() => {
    checkLocationPermission();
  }, []);

  useEffect(() => {
    const subcription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        checkLocationPermission();
      }
    });

    return () => {
      subcription.remove();
    };
  }, []);

  return <>{children}</>;
};

export default PermissionsCheckerProvider;
