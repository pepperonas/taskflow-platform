package io.celox.taskflow.task.workflow.executors;

import io.celox.taskflow.task.workflow.ExecutionContext;
import io.celox.taskflow.task.workflow.NodeExecutor;
import io.celox.taskflow.task.workflow.WorkflowNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class ConditionExecutor implements NodeExecutor {

    @Override
    public Object execute(WorkflowNode node, ExecutionContext context) {
        Map<String, Object> data = node.getData();

        context.log("Executing Condition node: " + node.getId());

        // Get condition parameters
        String leftOperand = resolveValue((String) data.get("left"), context);
        String operator = (String) data.get("operator");
        String rightOperand = resolveValue((String) data.get("right"), context);

        boolean result = evaluateCondition(leftOperand, operator, rightOperand);

        context.log("Condition evaluated: " + leftOperand + " " + operator + " " + rightOperand + " = " + result);
        context.setVariable(node.getId() + "_result", result);

        return result;
    }

    @Override
    public String getNodeType() {
        return "condition";
    }

    private String resolveValue(String value, ExecutionContext context) {
        if (value == null) {
            return null;
        }

        // Check if it's a variable reference like ${variableName}
        if (value.startsWith("${") && value.endsWith("}")) {
            String varName = value.substring(2, value.length() - 1);
            Object varValue = context.getVariable(varName);
            if (varValue == null) {
                varValue = context.getTriggerData().get(varName);
            }
            return varValue != null ? String.valueOf(varValue) : null;
        }

        return value;
    }

    private boolean evaluateCondition(String left, String operator, String right) {
        if (left == null || right == null) {
            return false;
        }

        switch (operator) {
            case "equals":
            case "==":
                return left.equals(right);
            case "notEquals":
            case "!=":
                return !left.equals(right);
            case "contains":
                return left.contains(right);
            case "startsWith":
                return left.startsWith(right);
            case "endsWith":
                return left.endsWith(right);
            case "greaterThan":
            case ">":
                try {
                    return Double.parseDouble(left) > Double.parseDouble(right);
                } catch (NumberFormatException e) {
                    return false;
                }
            case "lessThan":
            case "<":
                try {
                    return Double.parseDouble(left) < Double.parseDouble(right);
                } catch (NumberFormatException e) {
                    return false;
                }
            default:
                log.warn("Unknown operator: {}", operator);
                return false;
        }
    }
}
