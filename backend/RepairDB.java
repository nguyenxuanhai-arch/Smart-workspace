import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

public class RepairDB {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/smart_workspace";
        String user = "root";
        String pass = "123456";

        try (Connection conn = DriverManager.getConnection(url, user, pass);
             Statement stmt = conn.createStatement()) {
            int rows = stmt.executeUpdate("DELETE FROM flyway_schema_history WHERE version='12'");
            System.out.println("Deleted " + rows + " rows.");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
