import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .db import payment_collection


# GET : View All Payments
def get_payments(request):
    if request.method == "GET":
        payments = []

        for payment in payment_collection.find({}, {"_id": 0}):
            payments.append(payment)

        return JsonResponse(payments, safe=False)

    return JsonResponse({"error": "Invalid request method"}, status=400)


# POST : Add Payment
@csrf_exempt
def add_payment(request):
    if request.method == "POST":
        data = json.loads(request.body)

        # Check duplicate payment_id
        if payment_collection.find_one({"payment_id": data["payment_id"]}):
            return JsonResponse(
                {"error": "Payment ID already exists"},
                status=400
            )

        payment_collection.insert_one(data)

        return JsonResponse(
            {"message": "Payment added successfully"}
        )

    return JsonResponse({"error": "Invalid request method"}, status=400)


# PUT : Update Payment
@csrf_exempt
def update_payment(request, payment_id):
    if request.method == "PUT":
        data = json.loads(request.body)

        result = payment_collection.update_one(
            {"payment_id": payment_id},
            {"$set": data}
        )

        if result.modified_count > 0:
            return JsonResponse(
                {"message": "Payment updated successfully"}
            )

        return JsonResponse(
            {"error": "Payment not found or no changes made"},
            status=404
        )

    return JsonResponse({"error": "Invalid request method"}, status=400)


# DELETE : Delete Payment
@csrf_exempt
def delete_payment(request, payment_id):
    if request.method == "DELETE":

        result = payment_collection.delete_one(
            {"payment_id": payment_id}
        )

        if result.deleted_count > 0:
            return JsonResponse(
                {"message": "Payment deleted successfully"}
            )

        return JsonResponse(
            {"error": "Payment not found"},
            status=404
        )

    return JsonResponse({"error": "Invalid request method"}, status=400)