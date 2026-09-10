import assert from 'node:assert/strict';
import {resolveProjectProgression} from '/tmp/free-exploration-tests/lib/project-progression.js';
import {sceneMachineReducer,INITIAL_SCENE_MACHINE_STATE} from '/tmp/free-exploration-tests/lib/scene-machine.js';
const ids=['harubareun','project-02','fitmate'];
for(let mask=0;mask<8;mask++){
 const completed=ids.filter((_,i)=>mask&(1<<i));
 for(const id of ids){
  const p=resolveProjectProgression([...completed,...completed],id);
  assert.equal(p.progress,completed.length);assert.deepEqual(p.completedProjectIds,completed);
  assert(ids.every(key=>p.statuses[key]!=='locked'));
  const state={...INITIAL_SCENE_MACHINE_STATE,scene:{...INITIAL_SCENE_MACHINE_STATE.scene,sceneId:'world-overview',phase:'active',cameraPreset:'OVERVIEW'},worldProgress:{...INITIAL_SCENE_MACHINE_STATE.worldProgress,completedProjectIds:completed}};
  const selected=sceneMachineReducer(state,{type:'SELECT_ISLAND',projectId:id});
  assert.equal(selected.lastRejectedEvent,null);assert.equal(selected.scene.pendingScene.focusedIslandId,id);
 }
}
console.log('24 completion/selection combinations passed; arbitrary completion order never gates access.');
