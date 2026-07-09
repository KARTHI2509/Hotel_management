import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .db import hotel_collection


# GET : View All Hotels
def get_hotels(request):
    if request.method == "GET":
        hotels = []

        for hotel in hotel_collection.find({}, {"_id": 0}):
            hotels.append(hotel)

        return JsonResponse(hotels, safe=False)

    return JsonResponse({"error": "Invalid request method"}, status=400)


# POST : Add Hotel
@csrf_exempt
def add_hotel(request):
    if request.method == "POST":
        data = json.loads(request.body)

        # Check duplicate hotel_id
        if hotel_collection.find_one({"hotel_id": data["hotel_id"]}):
            return JsonResponse(
                {"error": "Hotel ID already exists"},
                status=400
            )

        hotel_collection.insert_one(data)

        return JsonResponse(
            {"message": "Hotel added successfully"}
        )

    return JsonResponse({"error": "Invalid request method"}, status=400)


# PUT : Update Hotel
@csrf_exempt
def update_hotel(request, hotel_id):
    if request.method == "PUT":
        data = json.loads(request.body)

        result = hotel_collection.update_one(
            {"hotel_id": hotel_id},
            {"$set": data}
        )

        if result.modified_count > 0:
            return JsonResponse(
                {"message": "Hotel updated successfully"}
            )

        return JsonResponse(
            {"error": "Hotel not found or no changes made"},
            status=404
        )

    return JsonResponse({"error": "Invalid request method"}, status=400)


# DELETE : Delete Hotel
@csrf_exempt
def delete_hotel(request, hotel_id):
    if request.method == "DELETE":

        result = hotel_collection.delete_one(
            {"hotel_id": hotel_id}
        )

        if result.deleted_count > 0:
            return JsonResponse(
                {"message": "Hotel deleted successfully"}
            )

        return JsonResponse(
            {"error": "Hotel not found"},
            status=404
        )

    return JsonResponse({"error": "Invalid request method"}, status=400)