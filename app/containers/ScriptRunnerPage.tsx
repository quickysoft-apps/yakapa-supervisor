import { bindActionCreators } from 'redux';
import { connect, Dispatch } from 'react-redux';
import { ScriptRunner, Props } from '../components/ScriptRunner';
import { Actions } from '../actions';
import { State } from '../reducers'

function mapStateToProps(state: State): Partial<Props> {
  return {    
    current: state.scriptRunner.current,
    running: state.scriptRunner.running,
    runs: state.scriptRunner.runs,    
  };
}

function mapDispatchToProps(dispatch: Dispatch<State>): Partial<Props> {
  return bindActionCreators(Actions.ScriptRunner as any, dispatch);
}

export default (connect(mapStateToProps, mapDispatchToProps)(ScriptRunner) as any);