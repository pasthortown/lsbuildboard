<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
Use Exception;
use App\History;
use App\HistoryAttachment;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class HistoryController extends Controller
{
    function get(Request $data)
    {
       $id = $data['id'];
       if ($id == null) {
          return response()->json(History::orderBy('id')->get(),200);
       } else {
          $history = History::findOrFail($id);
          $attach = HistoryAttachment::where('history_id', $id)->get();
          return response()->json(["History"=>$history, "attach"=>$attach],200);
       }
    }

    function by_project_id(Request $data)
    {
      $project_id = $data['project_id'];
      return response()->json(History::where('project_id', $project_id)->orderBy('id')->get(),200);
    }

    function paginate(Request $data)
    {
       $size = $data['size'];
       $project_id = $data['project_id'];
       return response()->json(History::where('project_id',$project_id)->orderBy('id')->paginate($size),200);
    }

    function post(Request $data)
    {
       try{
          DB::beginTransaction();
          $result = $data->json()->all();
          $history = new History();
          $lastHistory = History::orderBy('id')->get()->last();
          if($lastHistory) {
             $history->id = $lastHistory->id + 1;
          } else {
             $history->id = 1;
          }
          $history->description = $result['description'];
          $history->source = $result['source'];
          $history->dod_date_time = $result['dod_date_time'];
          $history->dor_date_time = $result['dor_date_time'];
          $history->state_id = $result['state_id'];
          $history->user_id = $result['user_id'];
          $history->priority_id = $result['priority_id'];
          $history->project_id = $result['project_id'];
          $history->save();
          DB::commit();
       } catch (Exception $e) {
          return $e;
       }
       return response()->json($history,200);
    }

    function put(Request $data)
    {
       try{
          DB::beginTransaction();
          $result = $data->json()->all();
          $history = History::where('id',$result['id'])->update([
             'description'=>$result['description'],
             'source'=>$result['source'],
             'dod_date_time'=>$result['dod_date_time'],
             'dor_date_time'=>$result['dor_date_time'],
             'state_id'=>$result['state_id'],
             'user_id'=>$result['user_id'],
             'priority_id'=>$result['priority_id'],
             'project_id'=>$result['project_id'],
          ]);
          DB::commit();
       } catch (Exception $e) {
          return response()->json($e,400);
       }
       return response()->json($history,200);
    }

    function save(Request $data)
    {
      try{
         DB::beginTransaction();
         $result = $data->json()->all();
         $history_id = $result['history']['id'];
         if ( $history_id == 0) {
            $history = new History();
            $lastHistory = History::orderBy('id')->get()->last();
            if($lastHistory) {
               $history->id = $lastHistory->id + 1;
            } else {
               $history->id = 1;
            }
            $history_id = $history->id;
            $history->description = $result['history']['description'];
            $history->source = $result['history']['source'];
            $history->dod_date_time = $result['history']['dod_date_time'];
            $history->dor_date_time = $result['history']['dor_date_time'];
            $history->state_id = $result['history']['state_id'];
            $history->user_id = $result['history']['user_id'];
            $history->priority_id = $result['history']['priority_id'];
            $history->project_id = $result['history']['project_id'];
            $history->save();
         } else {
            $history = History::where('id',$history_id)->update([
               'description'=>$result['history']['description'],
               'source'=>$result['history']['source'],
               'dod_date_time'=>$result['history']['dod_date_time'],
               'dor_date_time'=>$result['history']['dor_date_time'],
               'state_id'=>$result['history']['state_id'],
               'user_id'=>$result['history']['user_id'],
               'priority_id'=>$result['history']['priority_id'],
               'project_id'=>$result['history']['project_id'],
            ]);  
         }
         $attachments = $result['attachments'];
         $last_attachments = HistoryAttachment::where('history_id', $history_id)->get();
         foreach($last_attachments as $last_attachment) {
            HistoryAttachment::destroy($last_attachment['id']);
         }
         foreach($attachments as $attachment) {
            $historyattachment = new HistoryAttachment();
            $lastHistoryAttachment = HistoryAttachment::orderBy('id')->get()->last();
            if($lastHistoryAttachment) {
               $historyattachment->id = $lastHistoryAttachment->id + 1;
            } else {
               $historyattachment->id = 1;
            }
            $historyattachment->history_attachment_file_type = $attachment['history_attachment_file_type'];
            $historyattachment->history_attachment_file_name = $attachment['history_attachment_file_name'];
            $historyattachment->history_attachment_file = $attachment['history_attachment_file'];
            $historyattachment->history_id = $history_id;
            $historyattachment->save();
         }
         DB::commit();
      } catch (Exception $e) {
         return $e;
      }
      return response()->json($result,200);
    }

    function delete(Request $data)
    {
       $id = $data['id'];
       return History::destroy($id);
    }

    function backup(Request $data)
    {
       $histories = History::get();
       $toReturn = [];
       foreach( $histories as $history) {
          $attach = [];
          array_push($toReturn, ["History"=>$history, "attach"=>$attach]);
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
         $result = $row['History'];
         $exist = History::where('id',$result['id'])->first();
         if ($exist) {
           History::where('id', $result['id'])->update([
             'description'=>$result['description'],
             'source'=>$result['source'],
             'dod_date_time'=>$result['dod_date_time'],
             'dor_date_time'=>$result['dor_date_time'],
             'state_id'=>$result['state_id'],
             'user_id'=>$result['user_id'],
             'priority_id'=>$result['priority_id'],
             'project_id'=>$result['project_id'],
           ]);
         } else {
          $history = new History();
          $history->id = $result['id'];
          $history->description = $result['description'];
          $history->source = $result['source'];
          $history->dod_date_time = $result['dod_date_time'];
          $history->dor_date_time = $result['dor_date_time'];
          $history->state_id = $result['state_id'];
          $history->user_id = $result['user_id'];
          $history->priority_id = $result['priority_id'];
          $history->project_id = $result['project_id'];
          $history->save();
         }
       }
       DB::commit();
      } catch (Exception $e) {
         return response()->json($e,400);
      }
      return response()->json('Task Complete',200);
    }
}