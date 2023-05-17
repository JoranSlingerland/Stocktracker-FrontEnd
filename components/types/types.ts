interface UserInfo_Type {
  clientPrincipal: {
    userId: string;
    userRoles: string[];
    claims: string[];
    identityProvider: string;
    userDetails: string;
  };
}

interface TimeFramestate {
  timeFrame: 'max' | 'year' | 'month' | 'week' | 'ytd';
  setTimeFrame: React.Dispatch<
    React.SetStateAction<'max' | 'year' | 'month' | 'week' | 'ytd'>
  >;
}

export type { UserInfo_Type, TimeFramestate };
