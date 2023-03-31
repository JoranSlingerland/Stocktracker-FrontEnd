type UserInfo_Type = {
  clientPrincipal: {
    userId: string;
    userRoles: string[];
    claims: string[];
    identityProvider: string;
    userDetails: string;
  };
};

export type { UserInfo_Type };
