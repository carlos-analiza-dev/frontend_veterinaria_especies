import { PermissionStatus } from "@/core/permissions/interface/location-interface";
import {
  checkLocationPermission,
  requestlocationPermission,
} from "@/core/permissions/location";
import { create } from "zustand";

interface PermissionsState {
  locationStatus: PermissionStatus;

  requestLocationPermission: () => Promise<PermissionStatus>;
  checkLocationPermission: () => Promise<PermissionStatus>;
}

export const usePermissionsStore = create<PermissionsState>()((set) => ({
  locationStatus: PermissionStatus.CHECKING,

  requestLocationPermission: async () => {
    const status = await requestlocationPermission();

    set({ locationStatus: status });

    return status;
  },

  checkLocationPermission: async () => {
    const status = await checkLocationPermission();

    set({ locationStatus: status });

    return status;
  },
}));
