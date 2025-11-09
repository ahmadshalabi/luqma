package app.luqma.backend.util;

import java.util.List;

/**
 * Utility class for providing default values for null or invalid inputs.
 */
public final class DefaultValue {
    
    private DefaultValue() {
        throw new UnsupportedOperationException("Utility class");
    }
    
    /**
     * Returns the value if not null, otherwise returns the default value.
     *
     * @param value the value to check
     * @param defaultValue the default value to return if value is null
     * @param <T> the type of the value
     * @return the value or default value
     */
    public static <T> T orElse(T value, T defaultValue) {
        return value != null ? value : defaultValue;
    }
    
    /**
     * Returns the string if not null or blank, otherwise returns the default value.
     *
     * @param value the string to check
     * @param defaultValue the default value to return if value is null or blank
     * @return the value or default value
     */
    public static String orElseIfBlank(String value, String defaultValue) {
        return (value != null && !value.isBlank()) ? value : defaultValue;
    }
    
    /**
     * Returns the value if not null, otherwise returns 0.0.
     *
     * @param value the Double to check
     * @return the value or 0.0
     */
    public static Double orZeroDouble(Double value) {
        return value != null ? value : 0.0;
    }
    
    /**
     * Returns the value if not null, otherwise returns 0L.
     *
     * @param value the Long to check
     * @return the value or 0L
     */
    public static Long orZeroLong(Long value) {
        return value != null ? value : 0L;
    }
    
    /**
     * Returns the value if not null, otherwise returns 0.
     *
     * @param value the Integer to check
     * @return the value or 0
     */
    public static Integer orZeroInt(Integer value) {
        return value != null ? value : 0;
    }
    
    /**
     * Returns the list if not null, otherwise returns an empty list.
     *
     * @param list the list to check
     * @param <T> the type of elements in the list
     * @return the list or empty list
     */
    public static <T> List<T> orEmptyList(List<T> list) {
        return list != null ? list : List.of();
    }
}

