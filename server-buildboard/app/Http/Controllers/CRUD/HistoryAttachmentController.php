<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
Use Exception;
use App\HistoryAttachment;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class HistoryAttachmentController extends Controller
{
    function get(Request $data)
    {
       $id = $data['id'];
       if ($id == null) {
          return response()->json(HistoryAttachment::orderBy('id')->get(),200);
       } else {
          $historyattachment = HistoryAttachment::findOrFail($id);
          $attach = [];
          return response()->json(["HistoryAttachment"=>$historyattachment, "attach"=>$attach],200);
       }
    }

    function paginate(Request $data)
    {
       $size = $data['size'];
       return response()->json(HistoryAttachment::paginate($size),200);
    }

    function post(Request $data)
    {
       try{
          DB::beginTransaction();
          $result = $data->json()->all();
          $historyattachment = new HistoryAttachment();
          $lastHistoryAttachment = HistoryAttachment::orderBy('id')->get()->last();
          if($lastHistoryAttachment) {
             $historyattachment->id = $lastHistoryAttachment->id + 1;
          } else {
             $historyattachment->id = 1;
          }
          $historyattachment->history_attachment_file_type = $result['history_attachment_file_type'];
          $historyattachment->history_attachment_file_name = $result['history_attachment_file_name'];
          $historyattachment->history_attachment_file = $result['history_attachment_file'];
          $historyattachment->history_id = $result['history_id'];
          $historyattachment->save();
          DB::commit();
       } catch (Exception $e) {
          return response()->json($e,400);
       }
       return response()->json($historyattachment,200);
    }

    function put(Request $data)
    {
       try{
          DB::beginTransaction();
          $result = $data->json()->all();
          $historyattachment = HistoryAttachment::where('id',$result['id'])->update([
             'history_attachment_file_type'=>$result['history_attachment_file_type'],
             'history_attachment_file_name'=>$result['history_attachment_file_name'],
             'history_attachment_file'=>$result['history_attachment_file'],
             'history_id'=>$result['history_id'],
          ]);
          DB::commit();
       } catch (Exception $e) {
          return response()->json($e,400);
       }
       return response()->json($historyattachment,200);
    }

    function delete(Request $data)
    {
       $id = $data['id'];
       return HistoryAttachment::destroy($id);
    }

    function backup(Request $data)
    {
       $historyattachments = HistoryAttachment::get();
       $toReturn = [];
       foreach( $historyattachments as $historyattachment) {
          $attach = [];
          array_push($toReturn, ["HistoryAttachment"=>$historyattachment, "attach"=>$attach]);
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
         $result = $row['HistoryAttachment'];
         $exist = HistoryAttachment::where('id',$result['id'])->first();
         if ($exist) {
           HistoryAttachment::where('id', $result['id'])->update([
             'history_attachment_file_type'=>$result['history_attachment_file_type'],
             'history_attachment_file_name'=>$result['history_attachment_file_name'],
             'history_attachment_file'=>$result['history_attachment_file'],
             'history_id'=>$result['history_id'],
           ]);
         } else {
          $historyattachment = new HistoryAttachment();
          $historyattachment->id = $result['id'];
          $historyattachment->history_attachment_file_type = $result['history_attachment_file_type'];
          $historyattachment->history_attachment_file_name = $result['history_attachment_file_name'];
          $historyattachment->history_attachment_file = $result['history_attachment_file'];
          $historyattachment->history_id = $result['history_id'];
          $historyattachment->save();
         }
       }
       DB::commit();
      } catch (Exception $e) {
         return response()->json($e,400);
      }
      return response()->json('Task Complete',200);
    }
}