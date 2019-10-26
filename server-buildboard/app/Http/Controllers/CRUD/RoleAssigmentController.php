<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
Use Exception;
use App\RoleAssigment;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class RoleAssigmentController extends Controller
{
    function get(Request $data)
    {
       $id = $data['id'];
       if ($id == null) {
          return response()->json(RoleAssigment::orderBy('id')->get(),200);
       } else {
          $roleassigment = RoleAssigment::findOrFail($id);
          $attach = [];
          return response()->json(["RoleAssigment"=>$roleassigment, "attach"=>$attach],200);
       }
    }

    function paginate(Request $data)
    {
       $size = $data['size'];
       return response()->json(RoleAssigment::paginate($size),200);
    }

    function post(Request $data)
    {
       try{
          DB::beginTransaction();
          $result = $data->json()->all();
          $roleassigment = new RoleAssigment();
          $lastRoleAssigment = RoleAssigment::orderBy('id')->get()->last();
          if($lastRoleAssigment) {
             $roleassigment->id = $lastRoleAssigment->id + 1;
          } else {
             $roleassigment->id = 1;
          }
          $roleassigment->user_id = $result['user_id'];
          $roleassigment->role_id = $result['role_id'];
          $roleassigment->save();
          DB::commit();
       } catch (Exception $e) {
          return response()->json($e,400);
       }
       return response()->json($roleassigment,200);
    }

    function put(Request $data)
    {
       try{
          DB::beginTransaction();
          $result = $data->json()->all();
          $roleassigment = RoleAssigment::where('id',$result['id'])->update([
             'user_id'=>$result['user_id'],
             'role_id'=>$result['role_id'],
          ]);
          DB::commit();
       } catch (Exception $e) {
          return response()->json($e,400);
       }
       return response()->json($roleassigment,200);
    }

    function delete(Request $data)
    {
       $id = $data['id'];
       return RoleAssigment::destroy($id);
    }

    function backup(Request $data)
    {
       $roleassigments = RoleAssigment::get();
       $toReturn = [];
       foreach( $roleassigments as $roleassigment) {
          $attach = [];
          array_push($toReturn, ["RoleAssigment"=>$roleassigment, "attach"=>$attach]);
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
         $result = $row['RoleAssigment'];
         $exist = RoleAssigment::where('id',$result['id'])->first();
         if ($exist) {
           RoleAssigment::where('id', $result['id'])->update([
             'user_id'=>$result['user_id'],
             'role_id'=>$result['role_id'],
           ]);
         } else {
          $roleassigment = new RoleAssigment();
          $roleassigment->id = $result['id'];
          $roleassigment->user_id = $result['user_id'];
          $roleassigment->role_id = $result['role_id'];
          $roleassigment->save();
         }
       }
       DB::commit();
      } catch (Exception $e) {
         return response()->json($e,400);
      }
      return response()->json('Task Complete',200);
    }
}