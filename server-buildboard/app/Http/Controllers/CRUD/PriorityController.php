<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
Use Exception;
use App\Priority;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class PriorityController extends Controller
{
    function get(Request $data)
    {
       $id = $data['id'];
       if ($id == null) {
          return response()->json(Priority::orderBy('id')->get(),200);
       } else {
          $priority = Priority::findOrFail($id);
          $attach = [];
          return response()->json(["Priority"=>$priority, "attach"=>$attach],200);
       }
    }

    function paginate(Request $data)
    {
       $size = $data['size'];
       return response()->json(Priority::paginate($size),200);
    }

    function post(Request $data)
    {
       try{
          DB::beginTransaction();
          $result = $data->json()->all();
          $priority = new Priority();
          $lastPriority = Priority::orderBy('id')->get()->last();
          if($lastPriority) {
             $priority->id = $lastPriority->id + 1;
          } else {
             $priority->id = 1;
          }
          $priority->description = $result['description'];
          $priority->save();
          DB::commit();
       } catch (Exception $e) {
          return response()->json($e,400);
       }
       return response()->json($priority,200);
    }

    function put(Request $data)
    {
       try{
          DB::beginTransaction();
          $result = $data->json()->all();
          $priority = Priority::where('id',$result['id'])->update([
             'description'=>$result['description'],
          ]);
          DB::commit();
       } catch (Exception $e) {
          return response()->json($e,400);
       }
       return response()->json($priority,200);
    }

    function delete(Request $data)
    {
       $id = $data['id'];
       return Priority::destroy($id);
    }

    function backup(Request $data)
    {
       $priorities = Priority::get();
       $toReturn = [];
       foreach( $priorities as $priority) {
          $attach = [];
          array_push($toReturn, ["Priority"=>$priority, "attach"=>$attach]);
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
         $result = $row['Priority'];
         $exist = Priority::where('id',$result['id'])->first();
         if ($exist) {
           Priority::where('id', $result['id'])->update([
             'description'=>$result['description'],
           ]);
         } else {
          $priority = new Priority();
          $priority->id = $result['id'];
          $priority->description = $result['description'];
          $priority->save();
         }
       }
       DB::commit();
      } catch (Exception $e) {
         return response()->json($e,400);
      }
      return response()->json('Task Complete',200);
    }
}