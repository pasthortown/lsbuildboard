<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
Use Exception;
use App\State;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class StateController extends Controller
{
    function get(Request $data)
    {
       $id = $data['id'];
       if ($id == null) {
          return response()->json(State::orderBy('id')->get(),200);
       } else {
          $state = State::findOrFail($id);
          $attach = [];
          return response()->json(["State"=>$state, "attach"=>$attach],200);
       }
    }

    function paginate(Request $data)
    {
       $size = $data['size'];
       return response()->json(State::paginate($size),200);
    }

    function post(Request $data)
    {
       try{
          DB::beginTransaction();
          $result = $data->json()->all();
          $state = new State();
          $lastState = State::orderBy('id')->get()->last();
          if($lastState) {
             $state->id = $lastState->id + 1;
          } else {
             $state->id = 1;
          }
          $state->description = $result['description'];
          $state->save();
          DB::commit();
       } catch (Exception $e) {
          return response()->json($e,400);
       }
       return response()->json($state,200);
    }

    function put(Request $data)
    {
       try{
          DB::beginTransaction();
          $result = $data->json()->all();
          $state = State::where('id',$result['id'])->update([
             'description'=>$result['description'],
          ]);
          DB::commit();
       } catch (Exception $e) {
          return response()->json($e,400);
       }
       return response()->json($state,200);
    }

    function delete(Request $data)
    {
       $id = $data['id'];
       return State::destroy($id);
    }

    function backup(Request $data)
    {
       $states = State::get();
       $toReturn = [];
       foreach( $states as $state) {
          $attach = [];
          array_push($toReturn, ["State"=>$state, "attach"=>$attach]);
       }
       return response()->json($toReturn,200);
    }

    function masiveLoad(Request $data)
    {
      $incomming = $data->json()->all();
      $masiveData = $incomming['data'];
      try{
       DB::beginTransaction();
       foreach($masiveData as $row) {
         $result = $row['State'];
         $exist = State::where('id',$result['id'])->first();
         if ($exist) {
           State::where('id', $result['id'])->update([
             'description'=>$result['description'],
           ]);
         } else {
          $state = new State();
          $state->id = $result['id'];
          $state->description = $result['description'];
          $state->save();
         }
       }
       DB::commit();
      } catch (Exception $e) {
         return response()->json($e,400);
      }
      return response()->json('Task Complete',200);
    }
}