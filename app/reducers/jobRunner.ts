import { ipcRenderer } from 'electron';
import * as uuid from 'uuid';
import { IAction } from '../actions/helpers';
import { Actions } from '../actions';

export interface JobRunnerState {
  jobId: string;
  cron?: any;
  script?: string;
  title?: string;
  input: string;
  result: string;
  errorMessage?: string;
  isRunning: boolean;
}

const defaultJson = '{}';

const initialState = {
  jobId: uuid.v4(),
  isRunning: false, 
  input: defaultJson,
  result: defaultJson
}

export function jobRunner(state: JobRunnerState = initialState, action: IAction) {

  if (Actions.JobManager.select.test(action)) {
    return {
      ...state,
      ...action.payload.jobDefinition,
      isRunning: action.payload.isRunning
    };
  }

  if (Actions.JobRunner.started.test(action)) {
    return {
      ...state,
      jobId: action.payload.jobId,
      isRunning: true
    };
  }

  if (Actions.JobRunner.resultChanged.test(action) && action.payload.jobId === state.jobId) {
    return {
      ...state,
      result: action.payload.result,
      errorMessage: undefined
    };
  }

  if (Actions.JobRunner.error.test(action) && action.payload.jobId === state.jobId) {
    console.log('action.payload.error', action.payload.error)
    return {
      ...state,
      result: {},
      errorMessage: action.payload.error ? action.payload.error : undefined
    };
  }

  if (Actions.JobRunner.completed.test(action) && action.payload.jobId === state.jobId) {
    return {
      ...state,
      isRunning: false
    };
  }

  if (Actions.JobRunner.stopped.test(action) && action.payload.jobId === state.jobId) {
    return {
      ...state,
      isRunning: false
    };
  }

  if (Actions.JobRunner.stop.test(action)) {
    ipcRenderer.send('ipc/JOB_STOP', { jobId: state.jobId })
    return {
      ...state
    };
  }

  return state;
}

