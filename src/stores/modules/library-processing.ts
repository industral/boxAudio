export enum LogType {
  info,
  warn,
  error
}

export interface ILog {
  type: LogType,
  message: string,
  messageLong?: string
}

interface IState {
  isScanInProgress: boolean,
  logs: ILog[];
  files: number;
  processedFiles: number;
}

const internalState: IState = {
  isScanInProgress: false,
  logs: [],
  files: 0,
  processedFiles: 0
};

const actions = {
  // async startArmageddon() {
  //   return await http({
  //     method: 'POST',
  //     path: '/config/armageddon'
  //   });
  // },
};

const mutations = {
  setScanProgress(state: IState, isInProgress: boolean) {
    state.isScanInProgress = isInProgress;
  },

  addLog(state: IState, logItem: ILog) {
    state.logs.push(logItem);
  },

  setFilesCount(state: IState, filesCount: number) {
    state.files = filesCount;
  },

  setProcessedFilesCount(state: IState, processedFilesCount: number) {
    state.processedFiles = processedFilesCount;
  }
};

const getters = {
  // isArmageddonIsDone(state) {
  //   return state.armageddonStatus === 'complete';
  // },
};

export default {
  namespaced: true,
  state: internalState,
  actions,
  getters,
  mutations
};
