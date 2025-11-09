package app.luqma.backend.util;

import app.luqma.backend.exception.ResourceLoadException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.io.InputStream;

/**
 * Utility class for loading mock data from classpath resources.
 */
@Slf4j
public final class MockDataLoader {
    
    private static final String MOCK_BASE_PATH = "mocks/";
    
    private MockDataLoader() {
        throw new UnsupportedOperationException("Utility class");
    }
    
    /**
     * Loads mock data from a classpath resource and deserializes it to the specified type.
     *
     * @param fileName the name of the mock data file (relative to mocks/ directory)
     * @param objectMapper the ObjectMapper to use for deserialization
     * @param valueType the class type to deserialize into
     * @param <T> the type of the result
     * @return the deserialized object
     * @throws ResourceLoadException if the resource cannot be loaded or parsed
     */
    public static <T> T loadMockData(String fileName, ObjectMapper objectMapper, Class<T> valueType) {
        return loadResource(fileName, objectMapper, true, 
                inputStream -> objectMapper.readValue(inputStream, valueType));
    }
    
    /**
     * Loads mock data from a classpath resource and deserializes it using a TypeReference.
     * Useful for generic types like List&lt;T&gt;.
     *
     * @param fileName the name of the mock data file (relative to mocks/ directory)
     * @param objectMapper the ObjectMapper to use for deserialization
     * @param typeReference the TypeReference for the target type
     * @param <T> the type of the result
     * @return the deserialized object
     * @throws ResourceLoadException if the resource cannot be loaded or parsed
     */
    public static <T> T loadMockData(String fileName, ObjectMapper objectMapper, TypeReference<T> typeReference) {
        return loadResource(fileName, objectMapper, true, 
                inputStream -> objectMapper.readValue(inputStream, typeReference));
    }
    
    /**
     * Attempts to load mock data, returning null if the resource doesn't exist.
     * Does not throw exceptions for missing files, only for parsing errors.
     *
     * @param fileName the name of the mock data file (relative to mocks/ directory)
     * @param objectMapper the ObjectMapper to use for deserialization
     * @param valueType the class type to deserialize into
     * @param <T> the type of the result
     * @return the deserialized object, or null if the file doesn't exist
     * @throws ResourceLoadException if the resource exists but cannot be parsed
     */
    public static <T> T loadMockDataOrNull(String fileName, ObjectMapper objectMapper, Class<T> valueType) {
        return loadResource(fileName, objectMapper, false, 
                inputStream -> objectMapper.readValue(inputStream, valueType));
    }
    
    /**
     * Core method for loading resources with configurable error handling.
     * Extracts common resource loading logic to eliminate duplication.
     *
     * @param fileName the name of the mock data file (relative to mocks/ directory)
     * @param objectMapper the ObjectMapper (used for error context)
     * @param throwIfMissing whether to throw exception if file doesn't exist
     * @param deserializer function to deserialize the input stream
     * @param <T> the type of the result
     * @return the deserialized object, or null if file doesn't exist and throwIfMissing is false
     * @throws ResourceLoadException if the resource cannot be loaded or parsed
     */
    private static <T> T loadResource(
            String fileName, 
            ObjectMapper objectMapper, 
            boolean throwIfMissing,
            ResourceDeserializer<T> deserializer) {
        
        String resourcePath = MOCK_BASE_PATH + fileName;
        
        try {
            ClassPathResource resource = new ClassPathResource(resourcePath);
            
            if (!resource.exists()) {
                if (throwIfMissing) {
                    String errorMsg = "Mock data file not found: " + resourcePath;
                    log.error(errorMsg);
                    throw new ResourceLoadException(errorMsg);
                } else {
                    log.debug("Mock data file not found (optional): {}", resourcePath);
                    return null;
                }
            }
            
            try (InputStream inputStream = resource.getInputStream()) {
                T result = deserializer.deserialize(inputStream);
                log.debug("Successfully loaded mock data from: {}", resourcePath);
                return result;
            }
            
        } catch (IOException e) {
            String errorMsg = throwIfMissing 
                    ? "Failed to load mock data from: " + resourcePath
                    : "Failed to parse mock data from: " + resourcePath;
            log.error(errorMsg, e);
            throw new ResourceLoadException(errorMsg, e);
        }
    }
    
    /**
     * Functional interface for deserializing input streams.
     * Allows different deserialization strategies while sharing common resource loading logic.
     */
    @FunctionalInterface
    private interface ResourceDeserializer<T> {
        T deserialize(InputStream inputStream) throws IOException;
    }
}

