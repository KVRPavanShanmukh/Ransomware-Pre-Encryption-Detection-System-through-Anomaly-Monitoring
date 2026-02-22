import mysql.connector

try:
    connection = mysql.connector.connect(
        host="localhost",
        port=3306,
        user="root",
        password="shanmukh@2006",
        database="RANSOMWARE"
    )
    cursor = connection.cursor()

    # Attempt to add the role column
    try:
        cursor.execute("ALTER TABLE users ADD COLUMN role ENUM('admin', 'user') DEFAULT 'user'")
        print("Successfully added 'role' column.")
    except mysql.connector.Error as err:
        if err.errno == 1060: # Missing column error basically means it exists (Duplicate column name)
            print("'role' column already exists.")
        else:
            print(f"Error adding column: {err}")

    # Set admin to be an admin
    cursor.execute("UPDATE users SET role = 'admin' WHERE username = 'admin'")
    print("Updated 'admin' user to have 'admin' role.")
    
    connection.commit()
    print("Database modification complete.")

except Exception as e:
    print(f"Connection/execution error: {e}")
finally:
    if 'cursor' in locals():
        cursor.close()
    if 'connection' in locals() and connection.is_connected():
        connection.close()
