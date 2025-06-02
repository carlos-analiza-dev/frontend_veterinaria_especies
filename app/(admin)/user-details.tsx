import { obtenerUsuarioById } from "@/core/users/accions/get-user-byId";
import { UsersStackParamList } from "@/presentation/navigation/types";
import { RouteProp } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Text, View } from "react-native";

type UserDetailsRouteProp = RouteProp<UsersStackParamList, "UserDetails">;

interface UserDetailsScreenProps {
  route: UserDetailsRouteProp;
}

const UsersDetailsScreen = ({ route }: UserDetailsScreenProps) => {
  const { userId } = route.params;

  const { data, isError, isLoading } = useQuery({
    queryKey: ["usuario", userId],
    queryFn: () => obtenerUsuarioById(userId),
    retry: 0,
  });

  return (
    <View>
      <Text>UsersDetailsScreen</Text>
    </View>
  );
};

export default UsersDetailsScreen;
