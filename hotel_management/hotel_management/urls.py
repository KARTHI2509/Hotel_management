"""
URL configuration for hotel_management project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from hotels import views as hotel_views
from rooms import views as room_views
from customers import views as customer_views
from bookings import views as booking_views
from payment import views as payment_views
urlpatterns = [
    path('admin/', admin.site.urls),
    path("hotels/", hotel_views.get_hotels,name="get_hotels"),
    path("hotels/add/", hotel_views.add_hotel,name="add_hotel"),
    path("hotels/update/<int:hotel_id>/", hotel_views.update_hotel,name="update_hotel"),
    path("hotels/delete/<int:hotel_id>/", hotel_views.delete_hotel,name="delete_hotel"),
    path("rooms/", room_views.get_rooms,name="get_rooms"),
    path("rooms/add/", room_views.add_room,name="add_room"),
    path("rooms/update/<int:room_id>/", room_views.update_room,name="update_room"),
    path("rooms/delete/<int:room_id>/", room_views.delete_room,name="delete_room"),
     path("customers/", customer_views.get_customers,name="get_customers"),
    path("customers/add/", customer_views.add_customer,name="add_customer"),
    path("customers/update/<int:customer_id>/", customer_views.update_customer,name="update_customer"),
    path("customers/delete/<int:customer_id>/", customer_views.delete_customer,name="delete_customer"),
    path("bookings/", booking_views.get_bookings,name="get_bookings"),
    path("bookings/add/", booking_views.add_booking,name="add_booking"),
    path("bookings/update/<int:booking_id>/", booking_views.update_booking,name="update_booking"),
    path("bookings/delete/<int:booking_id>/", booking_views.delete_booking,name="delete_booking"),
    path("payments/", payment_views.get_payments,name="get_payments"),
    path("payments/add/", payment_views.add_payment,name="add_payment"),
    path("payments/update/<int:payment_id>/", payment_views.update_payment,name="update_payment"),
    path("payments/delete/<int:payment_id>/", payment_views.delete_payment,name="delete_payment"),
]
