// ==========================================================================
// HOTEL BOOKING SYSTEM CORE JAVASCRIPT
// ==========================================================================

const BASE_URL = "https://hotel-management-j3v2.onrender.com";

// Global cache variables to prevent string-interpolation single-quote bugs
let hotelsCached = [];
let roomsCached = [];
let customersCached = [];
let bookingsCached = [];
let paymentsCached = [];

// Edit trackers
let editHotelId = null;
let editRoomId = null;
let editCustomerId = null;
let editBookingId = null;
let editPaymentId = null;

// ==========================================================================
// HOTEL MANAGEMENT
// ==========================================================================

function getHotels() {
    fetch(BASE_URL + "/hotels/")
        .then(response => response.json())
        .then(data => {
            hotelsCached = data;
            displayHotels(data);
        })
        .catch(err => console.error("Error fetching hotels:", err));
}

function displayHotels(data) {
    const hotelList = document.getElementById("hotelList");
    if (!hotelList) return;

    hotelList.innerHTML = "";
    if (data.length === 0) {
        hotelList.innerHTML = `<div class="no-records"><i class="fa-solid fa-circle-info"></i> No hotels found.</div>`;
        return;
    }

    const hotelImages = [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80"
    ];

    data.forEach((hotel, index) => {
        const imgUrl = hotelImages[index % hotelImages.length];
        hotelList.innerHTML += `
        <div class="hotel-card">
            <span class="badge success"><i class="fa-solid fa-star" style="color: #FBBF24;"></i> ${hotel.rating}</span>
            <div class="card-image" style="background-image: url('${imgUrl}')"></div>
            <div class="card-body">
                <h3>${hotel.hotel_name}</h3>
                <p><i class="fa-solid fa-hashtag"></i> <b>Hotel ID :</b> ${hotel.hotel_id}</p>
                <p><i class="fa-solid fa-map-marker-alt"></i> <b>Location :</b> ${hotel.location}</p>
                <p><i class="fa-solid fa-city"></i> <b>City :</b> ${hotel.city}</p>
                <p><i class="fa-solid fa-phone"></i> <b>Contact :</b> ${hotel.contact}</p>
                <p><i class="fa-solid fa-envelope"></i> <b>Email :</b> ${hotel.email}</p>
                
                <div class="card-actions">
                    <button class="btn-success" onclick="loadHotel(${hotel.hotel_id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-danger" onclick="deleteHotel(${hotel.hotel_id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
        `;
    });
}

function addHotel() {
    const hotel = {
        hotel_id: Number(document.getElementById("hotel_id").value),
        hotel_name: document.getElementById("hotel_name").value,
        location: document.getElementById("location").value,
        city: document.getElementById("city").value,
        rating: Number(document.getElementById("rating").value),
        contact: document.getElementById("contact").value,
        email: document.getElementById("email").value
    };

    if (!hotel.hotel_id || !hotel.hotel_name || !hotel.city) {
        alert("Please fill in required fields.");
        return;
    }

    fetch(BASE_URL + "/hotels/add/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hotel)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message || data.error);
        if (!data.error) {
            clearHotelForm();
            getHotels();
        }
    })
    .catch(err => console.error("Error adding hotel:", err));
}

function loadHotel(id) {
    const hotel = hotelsCached.find(h => h.hotel_id === id);
    if (!hotel) return;

    editHotelId = id;
    document.getElementById("hotel_id").value = hotel.hotel_id;
    document.getElementById("hotel_name").value = hotel.hotel_name;
    document.getElementById("location").value = hotel.location;
    document.getElementById("city").value = hotel.city;
    document.getElementById("rating").value = hotel.rating;
    document.getElementById("contact").value = hotel.contact;
    document.getElementById("email").value = hotel.email;

    // Scroll to form
    document.querySelector("form").scrollIntoView({ behavior: 'smooth' });
}

function updateHotel() {
    if (editHotelId == null) {
        alert("Please click Edit on a hotel first.");
        return;
    }

    const hotel = {
        hotel_id: Number(document.getElementById("hotel_id").value),
        hotel_name: document.getElementById("hotel_name").value,
        location: document.getElementById("location").value,
        city: document.getElementById("city").value,
        rating: Number(document.getElementById("rating").value),
        contact: document.getElementById("contact").value,
        email: document.getElementById("email").value
    };

    fetch(BASE_URL + "/hotels/update/" + editHotelId + "/", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hotel)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message || data.error);
        if (!data.error) {
            clearHotelForm();
            getHotels();
        }
    })
    .catch(err => console.error("Error updating hotel:", err));
}

function deleteHotel(id) {
    if (!confirm("Are you sure you want to delete this hotel?")) return;

    fetch(BASE_URL + "/hotels/delete/" + id + "/", {
        method: "DELETE"
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message || data.error);
        getHotels();
    })
    .catch(err => console.error("Error deleting hotel:", err));
}

function clearHotelForm() {
    document.getElementById("hotel_id").value = "";
    document.getElementById("hotel_name").value = "";
    document.getElementById("location").value = "";
    document.getElementById("city").value = "";
    document.getElementById("rating").value = "";
    document.getElementById("contact").value = "";
    document.getElementById("email").value = "";
    editHotelId = null;
}

function searchHotel() {
    const searchCityEl = document.getElementById("searchCity");
    if (!searchCityEl) return;
    
    const city = searchCityEl.value.trim();

    // If on homepage or dashboard (where list doesn't exist), redirect to hotels.html
    if (!document.getElementById("hotelList")) {
        window.location.href = `hotels.html?city=${encodeURIComponent(city)}`;
        return;
    }

    fetch(BASE_URL + "/hotels/")
        .then(response => response.json())
        .then(data => {
            const result = data.filter(hotel =>
                hotel.city.toLowerCase().includes(city.toLowerCase())
            );
            displayHotels(result);
        })
        .catch(err => console.error("Error searching hotels:", err));
}

function filterRating() {
    const rating = Number(document.getElementById("filterRating").value);

    fetch(BASE_URL + "/hotels/")
        .then(response => response.json())
        .then(data => {
            if (rating === 0) {
                displayHotels(data);
                return;
            }
            const result = data.filter(hotel => hotel.rating >= rating);
            displayHotels(result);
        })
        .catch(err => console.error("Error filtering hotels:", err));
}


// ==========================================================================
// ROOM MANAGEMENT
// ==========================================================================

function getRooms() {
    fetch(BASE_URL + "/rooms/")
        .then(response => response.json())
        .then(data => {
            roomsCached = data;
            displayRooms(data);
        })
        .catch(err => console.error("Error fetching rooms:", err));
}

function displayRooms(data) {
    const roomList = document.getElementById("roomList");
    if (!roomList) return;

    roomList.innerHTML = "";
    if (data.length === 0) {
        roomList.innerHTML = `<div class="no-records"><i class="fa-solid fa-circle-info"></i> No rooms found.</div>`;
        return;
    }

    const roomImages = [
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80"
    ];

    data.forEach((room, index) => {
        const imgUrl = roomImages[index % roomImages.length];
        const badgeClass = room.status.toLowerCase() === 'available' ? 'available' : 'booked';
        roomList.innerHTML += `
        <div class="hotel-card">
            <span class="badge ${badgeClass}"><i class="fa-solid fa-circle-dot"></i> ${room.status}</span>
            <div class="card-image" style="background-image: url('${imgUrl}')"></div>
            <div class="card-body">
                <h3>${room.hotel_name}</h3>
                <p><i class="fa-solid fa-hashtag"></i> <b>Room ID :</b> ${room.room_id}</p>
                <p><i class="fa-solid fa-door-closed"></i> <b>Room No :</b> ${room.room_number}</p>
                <p><i class="fa-solid fa-bed"></i> <b>Room Type :</b> ${room.room_type}</p>
                <p><i class="fa-solid fa-indian-rupee-sign"></i> <b>Price :</b> ₹${room.price}</p>
                <p><i class="fa-solid fa-users"></i> <b>Capacity :</b> ${room.capacity} Guests</p>
                
                <div class="card-actions">
                    <button class="btn-success" onclick="loadRoom(${room.room_id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-danger" onclick="deleteRoom(${room.room_id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
        `;
    });
}

function addRoom() {
    const room = {
        room_id: Number(document.getElementById("room_id").value),
        hotel_name: document.getElementById("room_hotel_name").value,
        room_number: Number(document.getElementById("room_number").value),
        room_type: document.getElementById("room_type").value,
        price: Number(document.getElementById("price").value),
        capacity: Number(document.getElementById("capacity").value),
        status: document.getElementById("status").value
    };

    if (!room.room_id || !room.hotel_name || !room.room_number) {
        alert("Please fill in all required fields.");
        return;
    }

    fetch(BASE_URL + "/rooms/add/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(room)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message || data.error);
        if (!data.error) {
            clearRoomForm();
            getRooms();
        }
    })
    .catch(err => console.error("Error adding room:", err));
}

function loadRoom(id) {
    const room = roomsCached.find(r => r.room_id === id);
    if (!room) return;

    editRoomId = id;
    document.getElementById("room_id").value = room.room_id;
    document.getElementById("room_hotel_name").value = room.hotel_name;
    document.getElementById("room_number").value = room.room_number;
    document.getElementById("room_type").value = room.room_type;
    document.getElementById("price").value = room.price;
    document.getElementById("capacity").value = room.capacity;
    document.getElementById("status").value = room.status;

    document.querySelector("form").scrollIntoView({ behavior: 'smooth' });
}

function updateRoom() {
    if (editRoomId == null) {
        alert("Please click Edit on a room first.");
        return;
    }

    const room = {
        room_id: Number(document.getElementById("room_id").value),
        hotel_name: document.getElementById("room_hotel_name").value,
        room_number: Number(document.getElementById("room_number").value),
        room_type: document.getElementById("room_type").value,
        price: Number(document.getElementById("price").value),
        capacity: Number(document.getElementById("capacity").value),
        status: document.getElementById("status").value
    };

    fetch(BASE_URL + "/rooms/update/" + editRoomId + "/", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(room)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message || data.error);
        if (!data.error) {
            clearRoomForm();
            getRooms();
        }
    })
    .catch(err => console.error("Error updating room:", err));
}

function deleteRoom(id) {
    if (!confirm("Are you sure you want to delete this room?")) return;

    fetch(BASE_URL + "/rooms/delete/" + id + "/", {
        method: "DELETE"
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message || data.error);
        getRooms();
    })
    .catch(err => console.error("Error deleting room:", err));
}

function clearRoomForm() {
    document.getElementById("room_id").value = "";
    document.getElementById("room_hotel_name").value = "";
    document.getElementById("room_number").value = "";
    document.getElementById("room_type").value = "";
    document.getElementById("price").value = "";
    document.getElementById("capacity").value = "";
    document.getElementById("status").value = "";
    editRoomId = null;
}


// ==========================================================================
// CUSTOMER MANAGEMENT
// ==========================================================================

function getCustomers() {
    fetch(BASE_URL + "/customers/")
        .then(response => response.json())
        .then(data => {
            customersCached = data;
            displayCustomers(data);
        })
        .catch(err => console.error("Error fetching customers:", err));
}

function displayCustomers(data) {
    const customerList = document.getElementById("customerList");
    if (!customerList) return;

    customerList.innerHTML = "";
    if (data.length === 0) {
        customerList.innerHTML = `<div class="no-records"><i class="fa-solid fa-circle-info"></i> No customers registered.</div>`;
        return;
    }

    data.forEach(customer => {
        const initials = customer.full_name ? customer.full_name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : "C";
        customerList.innerHTML += `
        <div class="hotel-card">
            <div class="testimonial-avatar" style="width: 70px; height: 70px; font-size: 24px; margin: 30px auto 10px auto; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; background-image: var(--accent-gradient); color: white; box-shadow: var(--shadow-sm);">
                ${initials}
            </div>
            <div class="card-body">
                <h3 style="text-align: center; border-bottom: none; margin-bottom: 20px; padding-bottom: 0;">${customer.full_name}</h3>
                <p><i class="fa-solid fa-id-badge"></i> <b>Customer ID :</b> ${customer.customer_id}</p>
                <p><i class="fa-solid fa-envelope"></i> <b>Email :</b> ${customer.email}</p>
                <p><i class="fa-solid fa-phone"></i> <b>Phone :</b> ${customer.phone}</p>
                <p><i class="fa-solid fa-city"></i> <b>City :</b> ${customer.city}</p>
                <p><i class="fa-solid fa-location-dot"></i> <b>Address :</b> ${customer.address}</p>
                
                <div class="card-actions">
                    <button class="btn-success" onclick="loadCustomer(${customer.customer_id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-danger" onclick="deleteCustomer(${customer.customer_id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
        `;
    });
}

function addCustomer() {
    const customer = {
        customer_id: Number(document.getElementById("customer_id").value),
        full_name: document.getElementById("full_name").value,
        email: document.getElementById("customer_email").value,
        phone: document.getElementById("phone").value,
        city: document.getElementById("customer_city").value,
        address: document.getElementById("address").value
    };

    if (!customer.customer_id || !customer.full_name) {
        alert("Please fill in required fields.");
        return;
    }

    fetch(BASE_URL + "/customers/add/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customer)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message || data.error);
        if (!data.error) {
            clearCustomerForm();
            getCustomers();
        }
    })
    .catch(err => console.error("Error adding customer:", err));
}

function loadCustomer(id) {
    const customer = customersCached.find(c => c.customer_id === id);
    if (!customer) return;

    editCustomerId = id;
    document.getElementById("customer_id").value = customer.customer_id;
    document.getElementById("full_name").value = customer.full_name;
    document.getElementById("customer_email").value = customer.email;
    document.getElementById("phone").value = customer.phone;
    document.getElementById("customer_city").value = customer.city;
    document.getElementById("address").value = customer.address;

    document.querySelector("form").scrollIntoView({ behavior: 'smooth' });
}

function updateCustomer() {
    if (editCustomerId == null) {
        alert("Please click Edit on a customer first.");
        return;
    }

    const customer = {
        customer_id: Number(document.getElementById("customer_id").value),
        full_name: document.getElementById("full_name").value,
        email: document.getElementById("customer_email").value,
        phone: document.getElementById("phone").value,
        city: document.getElementById("customer_city").value,
        address: document.getElementById("address").value
    };

    fetch(BASE_URL + "/customers/update/" + editCustomerId + "/", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customer)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message || data.error);
        if (!data.error) {
            clearCustomerForm();
            getCustomers();
        }
    })
    .catch(err => console.error("Error updating customer:", err));
}

function deleteCustomer(id) {
    if (!confirm("Are you sure you want to delete this customer?")) return;

    fetch(BASE_URL + "/customers/delete/" + id + "/", {
        method: "DELETE"
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message || data.error);
        getCustomers();
    })
    .catch(err => console.error("Error deleting customer:", err));
}

function clearCustomerForm() {
    document.getElementById("customer_id").value = "";
    document.getElementById("full_name").value = "";
    document.getElementById("customer_email").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("customer_city").value = "";
    document.getElementById("address").value = "";
    editCustomerId = null;
}


// ==========================================================================
// BOOKING MANAGEMENT
// ==========================================================================

function getBookings() {
    fetch(BASE_URL + "/bookings/")
        .then(response => response.json())
        .then(data => {
            bookingsCached = data;
            displayBookings(data);
        })
        .catch(err => console.error("Error fetching bookings:", err));
}

function displayBookings(data) {
    const bookingList = document.getElementById("bookingList");
    if (!bookingList) return;

    bookingList.innerHTML = "";
    if (data.length === 0) {
        bookingList.innerHTML = `<div class="no-records"><i class="fa-solid fa-circle-info"></i> No bookings found.</div>`;
        return;
    }

    data.forEach(booking => {
        const badgeClass = booking.booking_status ? booking.booking_status.toLowerCase() : 'pending';
        bookingList.innerHTML += `
        <div class="hotel-card" style="border-left: 4px solid var(--primary);">
            <span class="badge ${badgeClass}"><i class="fa-solid fa-bell"></i> ${booking.booking_status || 'Pending'}</span>
            <div class="card-body">
                <h3 style="border-bottom: 1.5px dashed rgba(148, 163, 184, 0.3); padding-bottom: 12px;"><i class="fa-solid fa-user-check" style="color: var(--primary); font-size: 16px; margin-right: 8px;"></i> ${booking.customer_name}</h3>
                <p><i class="fa-solid fa-ticket"></i> <b>Booking ID :</b> ${booking.booking_id}</p>
                <p><i class="fa-solid fa-hotel"></i> <b>Hotel :</b> ${booking.hotel_name}</p>
                <p><i class="fa-solid fa-door-closed"></i> <b>Room No :</b> ${booking.room_number}</p>
                <p><i class="fa-solid fa-calendar-plus"></i> <b>Check In :</b> ${booking.check_in}</p>
                <p><i class="fa-solid fa-calendar-minus"></i> <b>Check Out :</b> ${booking.check_out}</p>
                <p><i class="fa-solid fa-wallet"></i> <b>Total :</b> ₹${booking.total_amount}</p>
                
                <div class="card-actions">
                    <button class="btn-success" onclick="loadBooking(${booking.booking_id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-danger" onclick="deleteBooking(${booking.booking_id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
        `;
    });
}

function addBooking() {
    const booking = {
        booking_id: Number(document.getElementById("booking_id").value),
        customer_name: document.getElementById("booking_customer_name").value,
        hotel_name: document.getElementById("booking_hotel_name").value,
        room_number: Number(document.getElementById("booking_room_number").value),
        check_in: document.getElementById("check_in").value,
        check_out: document.getElementById("check_out").value,
        total_amount: Number(document.getElementById("total_amount").value),
        booking_status: document.getElementById("booking_status").value
    };

    if (!booking.booking_id || !booking.customer_name || !booking.hotel_name || !booking.room_number) {
        alert("Please fill in required fields.");
        return;
    }

    fetch(BASE_URL + "/bookings/add/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message || data.error);
        if (!data.error) {
            clearBookingForm();
            getBookings();
        }
    })
    .catch(err => console.error("Error adding booking:", err));
}

function loadBooking(id) {
    const booking = bookingsCached.find(b => b.booking_id === id);
    if (!booking) return;

    editBookingId = id;
    document.getElementById("booking_id").value = booking.booking_id;
    
    // Set values for dropdown selections
    document.getElementById("booking_customer_name").value = booking.customer_name;
    document.getElementById("booking_hotel_name").value = booking.hotel_name;
    
    // Trigger room loading for the selected hotel, then select the room number
    loadRoomsForSelectedHotel(() => {
        document.getElementById("booking_room_number").value = booking.room_number;
    });

    document.getElementById("check_in").value = booking.check_in;
    document.getElementById("check_out").value = booking.check_out;
    document.getElementById("total_amount").value = booking.total_amount;
    document.getElementById("booking_status").value = booking.booking_status;

    document.querySelector("form").scrollIntoView({ behavior: 'smooth' });
}

function updateBooking() {
    if (editBookingId == null) {
        alert("Please click Edit on a booking first.");
        return;
    }

    const booking = {
        booking_id: Number(document.getElementById("booking_id").value),
        customer_name: document.getElementById("booking_customer_name").value,
        hotel_name: document.getElementById("booking_hotel_name").value,
        room_number: Number(document.getElementById("booking_room_number").value),
        check_in: document.getElementById("check_in").value,
        check_out: document.getElementById("check_out").value,
        total_amount: Number(document.getElementById("total_amount").value),
        booking_status: document.getElementById("booking_status").value
    };

    fetch(BASE_URL + "/bookings/update/" + editBookingId + "/", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message || data.error);
        if (!data.error) {
            clearBookingForm();
            getBookings();
        }
    })
    .catch(err => console.error("Error updating booking:", err));
}

function deleteBooking(id) {
    if (!confirm("Are you sure you want to delete this booking?")) return;

    fetch(BASE_URL + "/bookings/delete/" + id + "/", {
        method: "DELETE"
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message || data.error);
        getBookings();
    })
    .catch(err => console.error("Error deleting booking:", err));
}

function clearBookingForm() {
    document.getElementById("booking_id").value = "";
    document.getElementById("booking_customer_name").value = "";
    document.getElementById("booking_hotel_name").value = "";
    document.getElementById("booking_room_number").innerHTML = `<option value="">Select Room Number</option>`;
    document.getElementById("check_in").value = "";
    document.getElementById("check_out").value = "";
    document.getElementById("total_amount").value = "";
    document.getElementById("booking_status").value = "";
    editBookingId = null;
}


// ==========================================================================
// PAYMENT MANAGEMENT
// ==========================================================================

function getPayments() {
    fetch(BASE_URL + "/payments/")
        .then(response => response.json())
        .then(data => {
            paymentsCached = data;
            displayPayments(data);
        })
        .catch(err => console.error("Error fetching payments:", err));
}

function displayPayments(data) {
    const paymentList = document.getElementById("paymentList");
    if (!paymentList) return;

    paymentList.innerHTML = "";
    if (data.length === 0) {
        paymentList.innerHTML = `<div class="no-records"><i class="fa-solid fa-circle-info"></i> No payments made.</div>`;
        return;
    }

    data.forEach(payment => {
        const badgeClass = payment.payment_status ? payment.payment_status.toLowerCase() : 'pending';
        paymentList.innerHTML += `
        <div class="hotel-card" style="border-left: 4px solid var(--success);">
            <span class="badge ${badgeClass}"><i class="fa-solid fa-receipt"></i> ${payment.payment_status || 'Pending'}</span>
            <div class="card-body">
                <h3 style="border-bottom: 1.5px dashed rgba(148, 163, 184, 0.3); padding-bottom: 12px;"><i class="fa-solid fa-user-shield" style="color: var(--success); font-size: 16px; margin-right: 8px;"></i> ${payment.customer_name}</h3>
                <p><i class="fa-solid fa-file-invoice"></i> <b>Payment ID :</b> ${payment.payment_id}</p>
                <p><i class="fa-solid fa-ticket"></i> <b>Booking ID :</b> ${payment.booking_id}</p>
                <p><i class="fa-solid fa-wallet"></i> <b>Amount :</b> ₹${payment.amount}</p>
                <p><i class="fa-solid fa-credit-card"></i> <b>Method :</b> ${payment.payment_method}</p>
                
                <div class="card-actions">
                    <button class="btn-success" onclick="loadPayment(${payment.payment_id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-danger" onclick="deletePayment(${payment.payment_id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
        `;
    });
}

function addPayment() {
    const payment = {
        payment_id: Number(document.getElementById("payment_id").value),
        booking_id: Number(document.getElementById("payment_booking_id").value),
        customer_name: document.getElementById("payment_customer_name").value,
        amount: Number(document.getElementById("amount").value),
        payment_method: document.getElementById("payment_method").value,
        payment_status: document.getElementById("payment_status").value
    };

    if (!payment.payment_id || !payment.booking_id || !payment.amount) {
        alert("Please fill in required fields.");
        return;
    }

    fetch(BASE_URL + "/payments/add/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payment)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message || data.error);
        if (!data.error) {
            clearPaymentForm();
            getPayments();
        }
    })
    .catch(err => console.error("Error adding payment:", err));
}

function loadPayment(id) {
    const payment = paymentsCached.find(p => p.payment_id === id);
    if (!payment) return;

    editPaymentId = id;
    document.getElementById("payment_id").value = payment.payment_id;
    document.getElementById("payment_booking_id").value = payment.booking_id;
    document.getElementById("payment_customer_name").value = payment.customer_name;
    document.getElementById("amount").value = payment.amount;
    document.getElementById("payment_method").value = payment.payment_method;
    document.getElementById("payment_status").value = payment.payment_status;

    document.querySelector("form").scrollIntoView({ behavior: 'smooth' });
}

function updatePayment() {
    if (editPaymentId == null) {
        alert("Please click Edit on a payment first.");
        return;
    }

    const payment = {
        payment_id: Number(document.getElementById("payment_id").value),
        booking_id: Number(document.getElementById("payment_booking_id").value),
        customer_name: document.getElementById("payment_customer_name").value,
        amount: Number(document.getElementById("amount").value),
        payment_method: document.getElementById("payment_method").value,
        payment_status: document.getElementById("payment_status").value
    };

    fetch(BASE_URL + "/payments/update/" + editPaymentId + "/", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payment)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message || data.error);
        if (!data.error) {
            clearPaymentForm();
            getPayments();
        }
    })
    .catch(err => console.error("Error updating payment:", err));
}

function deletePayment(id) {
    if (!confirm("Are you sure you want to delete this payment?")) return;

    fetch(BASE_URL + "/payments/delete/" + id + "/", {
        method: "DELETE"
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message || data.error);
        getPayments();
    })
    .catch(err => console.error("Error deleting payment:", err));
}

function clearPaymentForm() {
    document.getElementById("payment_id").value = "";
    document.getElementById("payment_booking_id").value = "";
    document.getElementById("payment_customer_name").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("payment_method").value = "";
    document.getElementById("payment_status").value = "";
    editPaymentId = null;
}


// ==========================================================================
// DYNAMIC DROPDOWNS & INTERACTIVITY
// ==========================================================================

function populateDropdowns() {
    // 1. If on Room page, populate hotel dropdown
    const roomHotelSelect = document.getElementById("room_hotel_name");
    if (roomHotelSelect) {
        fetch(BASE_URL + "/hotels/")
            .then(res => res.json())
            .then(hotels => {
                roomHotelSelect.innerHTML = `<option value="">Select Hotel</option>`;
                hotels.forEach(h => {
                    roomHotelSelect.innerHTML += `<option value="${h.hotel_name}">${h.hotel_name}</option>`;
                });
            });
    }

    // 2. If on Booking page, populate customer & hotel dropdowns
    const bookingHotelSelect = document.getElementById("booking_hotel_name");
    const bookingCustomerSelect = document.getElementById("booking_customer_name");
    if (bookingHotelSelect && bookingCustomerSelect) {
        // Fetch hotels
        fetch(BASE_URL + "/hotels/")
            .then(res => res.json())
            .then(hotels => {
                bookingHotelSelect.innerHTML = `<option value="">Select Hotel</option>`;
                hotels.forEach(h => {
                    bookingHotelSelect.innerHTML += `<option value="${h.hotel_name}">${h.hotel_name}</option>`;
                });
            });

        // Fetch customers
        fetch(BASE_URL + "/customers/")
            .then(res => res.json())
            .then(customers => {
                bookingCustomerSelect.innerHTML = `<option value="">Select Customer</option>`;
                customers.forEach(c => {
                    bookingCustomerSelect.innerHTML += `<option value="${c.full_name}">${c.full_name}</option>`;
                });
            });

        // Attach listener to load rooms when hotel changes
        bookingHotelSelect.addEventListener("change", () => loadRoomsForSelectedHotel());
    }

    // 3. If on Payment page, populate booking dropdown
    const paymentBookingSelect = document.getElementById("payment_booking_id");
    if (paymentBookingSelect) {
        fetch(BASE_URL + "/bookings/")
            .then(res => res.json())
            .then(bookings => {
                bookingsCached = bookings; // cache bookings locally
                paymentBookingSelect.innerHTML = `<option value="">Select Booking ID</option>`;
                bookings.forEach(b => {
                    paymentBookingSelect.innerHTML += `<option value="${b.booking_id}">Booking #${b.booking_id} (${b.customer_name})</option>`;
                });
            });

        // Attach listener to auto-fill details on booking selection
        paymentBookingSelect.addEventListener("change", autoFillPaymentDetails);
    }
}

// Loads available rooms for selected hotel on Bookings page
function loadRoomsForSelectedHotel(callback) {
    const hotelName = document.getElementById("booking_hotel_name").value;
    const roomSelect = document.getElementById("booking_room_number");
    if (!roomSelect) return;

    if (!hotelName) {
        roomSelect.innerHTML = `<option value="">Select Room Number</option>`;
        return;
    }

    fetch(BASE_URL + "/rooms/")
        .then(res => res.json())
        .then(rooms => {
            // Filter rooms by hotel name and available status
            const filteredRooms = rooms.filter(r => 
                r.hotel_name.toLowerCase() === hotelName.toLowerCase() && 
                (r.status.toLowerCase() === 'available' || (editBookingId !== null && Number(document.getElementById("booking_room_number").dataset.currentRoom) === r.room_number))
            );

            roomSelect.innerHTML = `<option value="">Select Room Number</option>`;
            if (filteredRooms.length === 0) {
                roomSelect.innerHTML += `<option value="" disabled>No available rooms for this hotel</option>`;
            } else {
                filteredRooms.forEach(r => {
                    roomSelect.innerHTML += `<option value="${r.room_number}">Room ${r.room_number} (${r.room_type} - ₹${r.price})</option>`;
                });
            }

            if (callback) callback();
        });
}

// Autofills Customer Name and Amount on Payment page based on selected Booking
function autoFillPaymentDetails() {
    const bookingId = Number(document.getElementById("payment_booking_id").value);
    const customerInput = document.getElementById("payment_customer_name");
    const amountInput = document.getElementById("amount");

    if (!bookingId) {
        customerInput.value = "";
        amountInput.value = "";
        return;
    }

    const booking = bookingsCached.find(b => b.booking_id === bookingId);
    if (booking) {
        customerInput.value = booking.customer_name;
        amountInput.value = booking.total_amount;
    }
}


// ==========================================================================
// ADMIN DASHBOARD STATISTICS
// ==========================================================================

function loadDashboardStats() {
    Promise.all([
        fetch(BASE_URL + "/hotels/").then(res => res.json()).catch(() => []),
        fetch(BASE_URL + "/rooms/").then(res => res.json()).catch(() => []),
        fetch(BASE_URL + "/customers/").then(res => res.json()).catch(() => []),
        fetch(BASE_URL + "/bookings/").then(res => res.json()).catch(() => []),
        fetch(BASE_URL + "/payments/").then(res => res.json()).catch(() => [])
    ]).then(([hotels, rooms, customers, bookings, payments]) => {
        if (document.getElementById("totalHotels")) document.getElementById("totalHotels").textContent = hotels.length;
        if (document.getElementById("totalRooms")) document.getElementById("totalRooms").textContent = rooms.length;
        if (document.getElementById("totalCustomers")) document.getElementById("totalCustomers").textContent = customers.length;
        if (document.getElementById("totalBookings")) document.getElementById("totalBookings").textContent = bookings.length;
        if (document.getElementById("totalPayments")) document.getElementById("totalPayments").textContent = payments.length;
    });
}


// ==========================================================================
// CENTRALIZED WINDOW LOAD INITIALIZER
// ==========================================================================

window.onload = function() {
    // 1. Highlight current active navigation item
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll(".nav-links a");
    navLinks.forEach(link => {
        if (link.getAttribute("href") === currentPath) {
            link.classList.add("active");
        }
    });

    // 2. Load page-specific functions
    if (document.getElementById("hotelList")) {
        // Read URL query parameter for homepage search redirect
        const urlParams = new URLSearchParams(window.location.search);
        const cityParam = urlParams.get('city');
        
        if (cityParam) {
            document.getElementById("searchCity").value = cityParam;
            fetch(BASE_URL + "/hotels/")
                .then(res => res.json())
                .then(data => {
                    const result = data.filter(h => h.city.toLowerCase().includes(cityParam.toLowerCase()));
                    hotelsCached = data; // Cache all hotels for editing
                    displayHotels(result);
                });
        } else {
            getHotels();
        }
    }

    if (document.getElementById("roomList")) {
        getRooms();
    }

    if (document.getElementById("customerList")) {
        getCustomers();
    }

    if (document.getElementById("bookingList")) {
        getBookings();
    }

    if (document.getElementById("paymentList")) {
        getPayments();
    }

    if (document.getElementById("totalHotels")) {
        loadDashboardStats();
    }

    // 3. Populate dynamic dropdown elements on forms
    populateDropdowns();
};

// Navigation Hamburger Menu Toggler
function toggleMobileMenu() {
    const navLinks = document.querySelector(".nav-links");
    if (navLinks) {
        navLinks.classList.toggle("open");
    }
}
