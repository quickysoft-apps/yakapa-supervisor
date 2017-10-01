import { actionCreator, actionCreatorVoid } from './helpers';

import { Ipc } from '../api/ipc';
import { ipcRenderer } from 'electron';
const ipc = new Ipc(ipcRenderer);

export interface IpcEventArg {
  jobId: string;
  result?: any;
  error?: Object;
}

export interface JobDefinition {
  jobId: string;
  cron?: string;
  script: string;
  input: Object;
  title: string;
  scriptError?: Object;
}

export const started = actionCreator<IpcEventArg>('jobRunner/STARTED');
export const resultChanged = actionCreator<IpcEventArg>('jobRunner/RESULT_CHANGED');
export const error = actionCreator<IpcEventArg>('jobRunner/ERROR');
export const completed = actionCreator<IpcEventArg>('jobRunner/COMPLETED');
export const stopped = actionCreator<IpcEventArg>('jobRunner/STOPPED');
export const stop = actionCreatorVoid('jobRunner/STOP');
export const save = actionCreator<JobDefinition>('jobRunner/SAVE');
export const start = function (job: JobDefinition) {
  return (dispatch: Function, getState: Function) => {

    ipc.addListener('ipc/JOB_RESULT', (event: any, arg: any) => {      
      dispatch(resultChanged(arg));
    });

    ipc.addListener('ipc/JOB_ERROR', (event: any, arg: any) => {
      console.log('ipc/JOB_ERROR', arg)
      dispatch(error(arg));
    });

    ipc.addListener('ipc/JOB_STARTED', (event: any, arg: any) => {
      dispatch(started(arg));
    });

    ipc.addListener('ipc/JOB_COMPLETED', (event: any, arg: any) => {
      dispatch(completed(arg));
    });

    ipc.addListener('ipc/JOB_STOPPED', (event: any, arg: any) => {
      ipc.clearListeners();
      dispatch(stopped(arg));
    });

    const arg = {
      jobId: job.jobId,
      cron: job.cron,
      script: job.script,
      input: job.input
    }
    ipc.send('ipc/JOB_START', arg);

  }

}

