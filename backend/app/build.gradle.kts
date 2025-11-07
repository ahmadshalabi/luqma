plugins {
	java
	alias(libs.plugins.spring.boot)
	alias(libs.plugins.spring.dependency.management)
}

group = "app.luqma"
version = "0.0.1-SNAPSHOT"

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(25)
	}
}

configurations {
	compileOnly {
		extendsFrom(configurations.annotationProcessor.get())
	}
}

repositories {
	mavenCentral()
}

dependencies {
	// Spring Boot
	implementation(libs.bundles.spring.boot)
	annotationProcessor(libs.spring.boot.configuration.processor)

	// Lombok
	compileOnly(libs.lombok)
	annotationProcessor(libs.lombok)

	// Development Tools
	developmentOnly(libs.bundles.dev.tools)
	
	// Testing
	testImplementation(libs.bundles.testing)
	testRuntimeOnly(libs.junit.platform.launcher)
}

tasks.withType<Test> {
	useJUnitPlatform()
}
