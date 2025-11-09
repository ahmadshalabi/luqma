package app.luqma.backend.util;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Utility class for common collection operations.
 */
public final class CollectionUtils {
    
    private CollectionUtils() {
        throw new UnsupportedOperationException("Utility class");
    }
    
    /**
     * Creates a defensive copy of a list.
     * Returns an empty list if the input is null.
     *
     * @param list the list to copy
     * @param <T> the type of elements in the list
     * @return a new ArrayList containing the same elements, or empty list if input is null
     */
    public static <T> List<T> defensiveCopy(List<T> list) {
        return list != null ? new ArrayList<>(list) : new ArrayList<>();
    }
    
    /**
     * Returns an unmodifiable defensive copy of a list.
     * Returns an empty unmodifiable list if the input is null.
     *
     * @param list the list to copy
     * @param <T> the type of elements in the list
     * @return an unmodifiable list containing the same elements, or empty list if input is null
     */
    public static <T> List<T> unmodifiableDefensiveCopy(List<T> list) {
        return list != null ? Collections.unmodifiableList(new ArrayList<>(list)) : Collections.emptyList();
    }
}

