import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .db import booking_collection


# GET : View All Bookings
def get_bookings(request):
    if request.method == "GET":
        bookings = []

        for booking in booking_collection.find({}, {"_id": 0}):
            bookings.append(booking)

        return JsonResponse(bookings, safe=False)

    return JsonResponse({"error": "Invalid request method"}, status=400)


# POST : Add Booking
@csrf_exempt
def add_booking(request):
    if request.method == "POST":
        data = json.loads(request.body)

        # Check duplicate booking_id
        if booking_collection.find_one({"booking_id": data["booking_id"]}):
            return JsonResponse(
                {"error": "Booking ID already exists"},
                status=400
            )

        booking_collection.insert_one(data)

        return JsonResponse(
            {"message": "Booking added successfully"}
        )

    return JsonResponse({"error": "Invalid request method"}, status=400)


# PUT : Update Booking
@csrf_exempt
def update_booking(request, booking_id):
    if request.method == "PUT":
        data = json.loads(request.body)

        result = booking_collection.update_one(
            {"booking_id": booking_id},
            {"$set": data}
        )

        if result.modified_count > 0:
            return JsonResponse(
                {"message": "Booking updated successfully"}
            )

        return JsonResponse(
            {"error": "Booking not found or no changes made"},
            status=404
        )

    return JsonResponse({"error": "Invalid request method"}, status=400)


# DELETE : Delete Booking
@csrf_exempt
def delete_booking(request, booking_id):
    if request.method == "DELETE":

        result = booking_collection.delete_one(
            {"booking_id": booking_id}
        )

        if result.deleted_count > 0:
            return JsonResponse(
                {"message": "Booking deleted successfully"}
            )

        return JsonResponse(
            {"error": "Booking not found"},
            status=404
        )

    return JsonResponse({"error": "Invalid request method"}, status=400)