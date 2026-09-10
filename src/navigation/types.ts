import { CellSaltId } from '../types';

export type RootStackParamList = {
  MainTabs: { screen?: keyof MainTabParamList } | undefined;
  CellSaltDetail: { saltId: CellSaltId };
  FindMySalt: undefined;
  LogEntry: { saltId?: CellSaltId };
  LogDetail: { logId: string };
};

export type MainTabParamList = {
  Home: undefined;
  Tracker: undefined;
  Analytics: undefined;
  Profile: undefined;
};
