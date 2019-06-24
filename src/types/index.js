import { tranObj, getModel } from "../components/common";
import user from "./user";
import dict from "./dict";
import role from "./role";
import dictItem from "./dictItem";
import area from "./area";
import dep from "./dep";
import ticketType from "./ticketType";
import ticketState from "./ticketState";
import ticketAction from "./ticketAction";
import ticketActionField from "./ticketActionField";
import bizEvent from "./biz_event";
import ticket from "./ticket";
import model from "./model";
import modelChannel from "./model_channel";
import device from "./device";
import station from "./station";
import sensor from "./sensor";
import video from "./video";
import videoStream from "./video_stream";
import unit from "./unit";
import community from "./community";

export default {
  newUser: tranObj(user),
  userModel: getModel(user),
  newDict: tranObj(dict),
  dictModel: getModel(dict),
  newDictItem: tranObj(dictItem),
  dictItemModel: getModel(dictItem),
  newRole: tranObj(role),
  roleModel: getModel(role),
  newArea: tranObj(area),
  areaModel: getModel(area),
  newDep: tranObj(dep),
  depModel: getModel(dep),
  newTicketType: tranObj(ticketType),
  ticketTypeModel: getModel(ticketType),
  newTicketState: tranObj(ticketState),
  ticketStateModel: getModel(ticketState),
  newTicketAction: tranObj(ticketAction),
  ticketActionModel: getModel(ticketAction),
  newTicketActionField: tranObj(ticketActionField),
  ticketActionFieldModel: getModel(ticketActionField),
  newBizEvent: tranObj(bizEvent),
  bizEventModel: getModel(bizEvent),
  newTicket: tranObj(ticket),
  ticketModel: getModel(ticket),
  newModel: tranObj(model),
  modelModel: getModel(model),
  newModelChannel: tranObj(modelChannel),
  channelModelModel: getModel(modelChannel),
  newDevice: tranObj(device),
  deviceModel: getModel(device),
  newStation: tranObj(station),
  stationModel: getModel(station),
  newSensor: tranObj(sensor),
  sensorModel: getModel(sensor),
  newVideo: tranObj(video),
  videoModel: getModel(video),
  newVideoStream: tranObj(videoStream),
  videoStreamModel: getModel(videoStream),
  newUnit: tranObj(unit),
  unitModel: getModel(unit),
  communityModel: getModel(community)
};
