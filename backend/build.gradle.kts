plugins {
	java
	jacoco
	alias(libs.plugins.spring.boot)
	alias(libs.plugins.spring.dependency.management)
	alias(libs.plugins.owasp.dependencycheck)
}

group = "app.luqma"
version = "0.1.0"

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

	// Caching
	implementation(libs.spring.boot.starter.cache)
	implementation(libs.caffeine)

	// OpenAPI Documentation
	implementation(libs.springdoc.openapi.starter.webmvc.ui)

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

// Load environment variables from .env file if it exists
tasks.named<org.springframework.boot.gradle.tasks.run.BootRun>("bootRun") {
	val envFile = file(".env")
	if (envFile.exists()) {
		envFile.readLines()
			.filter { it.isNotBlank() && !it.startsWith("#") }
			.forEach { line ->
				val (key, value) = line.split("=", limit = 2)
				environment(key.trim(), value.trim())
			}
	}
}

// JaCoCo Configuration
jacoco {
	toolVersion = libs.versions.jacoco.get()
}

tasks.jacocoTestReport {
	dependsOn(tasks.test)
	reports {
		xml.required.set(true)
		html.required.set(true)
		html.outputLocation.set(layout.buildDirectory.dir("reports/jacoco"))
	}
}

tasks.jacocoTestCoverageVerification {
	violationRules {
		// Services: 80% coverage requirement
		rule {
			element = "PACKAGE"
			includes = listOf("app.luqma.backend.service")
			limit {
				counter = "LINE"
				minimum = "0.80".toBigDecimal()
			}
		}
		// Controllers: 70% coverage requirement
		rule {
			element = "PACKAGE"
			includes = listOf("app.luqma.backend.controller")
			limit {
				counter = "LINE"
				minimum = "0.70".toBigDecimal()
			}
		}
	}
}

// OWASP Dependency-Check Configuration
configure<org.owasp.dependencycheck.gradle.extension.DependencyCheckExtension> {
	formats = listOf("HTML", "JSON")
	scanConfigurations = listOf("runtimeClasspath")
	suppressionFile = file("dependency-check-suppressions.xml").takeIf { it.exists() }?.absolutePath
	failBuildOnCVSS = 7.0f
	analyzers.apply {
		assemblyEnabled = false
		nugetconfEnabled = false
		nodeEnabled = false
	}
}
