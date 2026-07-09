import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .db import customer_collection


# GET : View All Customers
def get_customers(request):
    if request.method == "GET":
        customers = []

        for customer in customer_collection.find({}, {"_id": 0}):
            customers.append(customer)

        return JsonResponse(customers, safe=False)

    return JsonResponse({"error": "Invalid request method"}, status=400)


# POST : Add Customer
@csrf_exempt
def add_customer(request):
    if request.method == "POST":
        data = json.loads(request.body)

        # Check duplicate customer_id
        if customer_collection.find_one({"customer_id": data["customer_id"]}):
            return JsonResponse(
                {"error": "Customer ID already exists"},
                status=400
            )

        customer_collection.insert_one(data)

        return JsonResponse(
            {"message": "Customer added successfully"}
        )

    return JsonResponse({"error": "Invalid request method"}, status=400)


# PUT : Update Customer
@csrf_exempt
def update_customer(request, customer_id):
    if request.method == "PUT":
        data = json.loads(request.body)

        result = customer_collection.update_one(
            {"customer_id": customer_id},
            {"$set": data}
        )

        if result.modified_count > 0:
            return JsonResponse(
                {"message": "Customer updated successfully"}
            )

        return JsonResponse(
            {"error": "Customer not found or no changes made"},
            status=404
        )

    return JsonResponse({"error": "Invalid request method"}, status=400)


# DELETE : Delete Customer
@csrf_exempt
def delete_customer(request, customer_id):
    if request.method == "DELETE":

        result = customer_collection.delete_one(
            {"customer_id": customer_id}
        )

        if result.deleted_count > 0:
            return JsonResponse(
                {"message": "Customer deleted successfully"}
            )

        return JsonResponse(
            {"error": "Customer not found"},
            status=404
        )

    return JsonResponse({"error": "Invalid request method"}, status=400)