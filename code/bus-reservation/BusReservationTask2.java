import java.util.*;
import java.util.concurrent.LinkedBlockingQueue;

// Customer class
class Customer {
    String name;
    String mobile;
    String email;
    String city;
    int age;

    public Customer(String name, String mobile, String email, String city, int age) {
        this.name = name;
        this.mobile = mobile;
        this.email = email;
        this.city = city;
        this.age = age;
    }

    @Override
    public String toString() {
        return name + " (" + age + ")";
    }
}

// Bus class
class Bus {
    String busNumber;
    int totalSeats;
    String startingPoint;
    String endingPoint;
    String startingTime;
    double fare;
    boolean[] seats; // True if reserved, false if available
    Queue<Customer> reservationQueue; // Queue for seat reservations

    public Bus(String busNumber, int totalSeats, String startingPoint, String endingPoint, String startingTime, double fare) {
        this.busNumber = busNumber;
        this.totalSeats = totalSeats;
        this.startingPoint = startingPoint;
        this.endingPoint = endingPoint;
        this.startingTime = startingTime;
        this.fare = fare;
        this.seats = new boolean[totalSeats];
        this.reservationQueue = new LinkedBlockingQueue<>();
    }

    public boolean reserveSeat(Customer customer) {
        for (int i = 0; i < totalSeats; i++) {
            if (!seats[i]) {
                seats[i] = true;
                reservationQueue.add(customer);
                return true;
            }
        }
        return false;
    }

    public boolean cancelReservation(Customer customer) {
        for (int i = 0; i < totalSeats; i++) {
            if (seats[i]) {
                seats[i] = false;
                reservationQueue.remove(customer);
                return true;
            }
        }
        return false;
    }

    public void displayReservations() {
        System.out.println("Reservations for bus " + busNumber + ":");
        reservationQueue.forEach(System.out::println);
    }
}

// Test application
public class BusReservationSystem {
    public static void main(String[] args) {
        // Create customers
        Customer alice = new Customer("Alice", "1234567890", "alice@example.com", "New York", 30);
        Customer bob = new Customer("Bob", "0987654321", "bob@example.com", "Los Angeles", 25);
        Customer charlie = new Customer("Charlie", "5551234567", "charlie@example.com", "Chicago", 40);
        Customer david = new Customer("David", "4449876543", "david@example.com", "Houston", 35);
        Customer eve = new Customer("Eve", "3336549870", "eve@example.com", "Phoenix", 28);

        // Create a bus
        Bus bus = new Bus("B123", 5, "New York", "Los Angeles", "08:00 AM", 50.00);

        // Reserve seats
        bus.reserveSeat(alice);
        bus.reserveSeat(bob);
        bus.reserveSeat(charlie);

        // Display reservations
        bus.displayReservations();

        // Cancel reservation
        bus.cancelReservation(bob);

        // Display updated reservations
        bus.displayReservations();
    }
}
Error Handling
In this implementation, I used basic error handling to ensure proper behavior. The reserveSeat() method returns true if a reservation is successful and false if no seats are available. Similarly, the cancelReservation() method returns true if a reservation is successfully canceled, and false if there's an error in canceling.
