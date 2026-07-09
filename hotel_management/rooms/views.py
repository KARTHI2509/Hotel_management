import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .db import room_collection


# GET : View All Rooms
def get_rooms(request):
    if request.method == "GET":
        rooms = []

        for room in room_collection.find({}, {"_id": 0}):
            rooms.append(room)

        return JsonResponse(rooms, safe=False)

    return JsonResponse({"error": "Invalid request method"}, status=400)


# POST : Add Room
@csrf_exempt
def add_room(request):
    if request.method == "POST":
        data = json.loads(request.body)

        # Check duplicate room_id
        if room_collection.find_one({"room_id": data["room_id"]}):
            return JsonResponse(
                {"error": "Room ID already exists"},
                status=400
            )

        room_collection.insert_one(data)

        return JsonResponse(
            {"message": "Room added successfully"}
        )

    return JsonResponse({"error": "Invalid request method"}, status=400)


# PUT : Update Room
@csrf_exempt
def update_room(request, room_id):
    if request.method == "PUT":
        data = json.loads(request.body)

        result = room_collection.update_one(
            {"room_id": room_id},
            {"$set": data}
        )

        if result.modified_count > 0:
            return JsonResponse(
                {"message": "Room updated successfully"}
            )

        return JsonResponse(
            {"error": "Room not found or no changes made"},
            status=404
        )

    return JsonResponse({"error": "Invalid request method"}, status=400)


# DELETE : Delete Room
@csrf_exempt
def delete_room(request, room_id):
    if request.method == "DELETE":

        result = room_collection.delete_one(
            {"room_id": room_id}
        )

        if result.deleted_count > 0:
            return JsonResponse(
                {"message": "Room deleted successfully"}
            )

        return JsonResponse(
            {"error": "Room not found"},
            status=404
        )

    return JsonResponse({"error": "Invalid request method"}, status=400)